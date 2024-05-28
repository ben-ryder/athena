import {ZodTypeAny} from "zod";
import {ActionResult, ErrorObject, ErrorTypes, Query, QUERY_LOADING, QueryStatus} from "../control-flow";
import {LocalfulEncryption} from "../encryption/localful-encryption";
import {memoryCache} from "./memory-cache";
import {Observable} from "rxjs";
import {DataChangeEvent, EventTypes} from "../events/events";
import {IDBPDatabase, openDB} from "idb";
import {Entity, EntityDto, EntityUpdate, EntityVersion, LocalEntity} from "@localful-athena/types/data-entities";
import {EventManager} from "@localful-athena/events/event-manager";
import { Logger } from "../../src/utils/logger";
import {
	CurrentSchemaData,
	DataSchemaDefinition, LocalEntityWithExposedFields,
	QueryDefinition,
	QueryIndex,
	TableKeys
} from "@localful-athena/storage/types";

export interface LocalfulDatabaseConfig {
	dataSchema: DataSchemaDefinition,
	getEncryptionKey: (databaseId: string) => Promise<CryptoKey>
	eventManager: EventManager
}

const LOCALFUL_INDEXDB_VERSION = 1
const LOCALFUL_VERSION = '1.0'

export class LocalfulDatabase<DataSchema extends DataSchemaDefinition> {
	dataSchema: DataSchemaDefinition
	_db?: IDBPDatabase
	currentDatabaseId?: string
	eventManager: EventManager
	getEncryptionKey: LocalfulDatabaseConfig['getEncryptionKey']

	constructor(
		config: LocalfulDatabaseConfig
	) {
		this.dataSchema = config.dataSchema
		this.eventManager = config.eventManager
		this.getEncryptionKey = config.getEncryptionKey
	}

	async getDb() {
		if (this._db && this._db.name === this.currentDatabaseId) {
			return this._db
		}
		if (this._db && this._db.name !== this.currentDatabaseId) {
			// todo: need to await this somehow?
			this._db.close()
		}

		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")

		return openDB(this.currentDatabaseId, LOCALFUL_INDEXDB_VERSION, {
			// todo: handle upgrades to existing database versions
			upgrade: (db) => {
				for (const [tableKey, schemaDefinition] of Object.entries(this.dataSchema.tables)) {
					// Create entity store
					const entityStore = db.createObjectStore(tableKey, {
						keyPath: 'id',
						autoIncrement: false
					})
					entityStore.createIndex('isDeleted', 'isDeleted')
					entityStore.createIndex('createdAt', ['createdAt', 'isDeleted'])

					// Add exposed field indexes
					const exposedFields = schemaDefinition.schemas[schemaDefinition.currentSchema].exposedFields
					if (exposedFields) {
						for (const [exposedField, fieldType] of Object.entries(exposedFields)) {
							if (fieldType === 'indexed') {
								// todo: add createdAt to index, which might help with sorting?
								entityStore.createIndex(exposedField, [exposedField, 'isDeleted'])
							}
						}
					}

					// Create entity version store
					const entityVersionStore = db.createObjectStore(this._getVersionTableName(tableKey), {
						keyPath: 'id',
						autoIncrement: false
					})
					entityVersionStore.createIndex('entityId', 'entityId')
					entityVersionStore.createIndex('createdAt', 'createdAt')
				}
			},
		})
	}
	
	setCurrentDatabase(databaseId: string) {
		this.currentDatabaseId = databaseId
		this.eventManager.dispatch(EventTypes.DATABASE_SWITCH, {id: this.currentDatabaseId})
	}

	closeCurrentDatabase() {
		if (this._db) {
			this._db.close()
		}

		if (this.currentDatabaseId) {
			this.eventManager.dispatch(EventTypes.DATABASE_CLOSE, {id: this.currentDatabaseId})
		}
		this.currentDatabaseId = undefined
	}

	deleteDatabase(databaseId: string) {
		// todo: handle if database doesn't exist?
		indexedDB.deleteDatabase(databaseId)
	}
	
	private _getVersionTableName(tableKey: string): string {
		return `${tableKey}_versions`
	}

	/**
	 * Create a DTO object from the given entity and version.
	 *
	 * @param tableKey
	 * @param entity
	 * @param version
	 * @param dataSchema
	 */
	async _createEntityVersionDto<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entity: Entity, version: EntityVersion, dataSchema: ZodTypeAny): Promise<ActionResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>>> {
		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")
		const encryptionKey = await this.getEncryptionKey(this.currentDatabaseId)

		const decryptedData = await LocalfulEncryption.decryptAndValidateData<CurrentSchemaData<DataSchema, TableKey>>(
			encryptionKey,
			dataSchema,
			version.data
		)
		if (!decryptedData.success) return decryptedData

		let data = decryptedData.data
		if (version.schemaVersion !== this.dataSchema['tables'][tableKey].currentSchema) {
			if (!this.dataSchema['tables'][tableKey].migrateSchema) {
				throw new Error(`Schema migration required from ${version.schemaVersion} to ${this.dataSchema['tables'][tableKey].currentSchema} but no migrateSchema method supplied`)
			}

			// @ts-expect-error - the existence of migrateSchema is checked above, and passing this is fine.
			data = await this.dataSchema[tableKey].migrateSchema(this, version.schemaVersion, this.dataSchema[tableKey].currentSchema, decryptedData.data)
			await this.update(tableKey, entity.id, data)
		}

		return {
			success: true,
			data: {
				id: entity.id,
				versionId: version.id,
				createdAt: entity.createdAt,
				updatedAt: version.createdAt,
				data: data,
				localfulVersion: entity.localfulVersion,
				isDeleted: entity.isDeleted,
			}
		}
	}

	/**
	 * Get a single entity, loading the current version.
	 *
	 * @param tableKey
	 * @param id
	 */
	async get<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, id: string): Promise<ActionResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>>> {
		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			const cachedResponse = await memoryCache.get<CurrentSchemaData<DataSchema, TableKey>>(`${tableKey}-get-${id}`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse}
			}
		}

		const db = await this.getDb()
		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readonly')
		const entity = await tx.objectStore(tableKey).get(id) as LocalEntity|undefined
		if (!entity) {
			return {success: false, errors: [{type: ErrorTypes.ENTITY_NOT_FOUND, context: id}]}
		}

		let version: EntityVersion|undefined = undefined
		if (entity.currentVersionId) {
			version = await tx.objectStore(this._getVersionTableName(tableKey)).get(entity.currentVersionId) as EntityVersion|undefined

			// Don't fall back to loading latest version as this state should never be possible and shouldn't fail silently.
			if (!version) {
				return {success: false, errors: [{type: ErrorTypes.VERSION_NOT_FOUND, context: id}]}
			}
		}
		else {
			const allVersions = await tx.objectStore(this._getVersionTableName(tableKey)).getAll() as EntityVersion[]
			const sortedVersions = allVersions.sort((a, b) => {
				return a.createdAt < b.createdAt ? 1 : 0
			})
			if (sortedVersions[0]) {
				version = sortedVersions[0]
			}
			else {
				return {success: false, errors: [{type: ErrorTypes.ENTITY_WITHOUT_VERSION, context: id}]}
			}
		}

		await tx.done

		const dto = await this._createEntityVersionDto<CurrentSchemaData<DataSchema, TableKey>>(tableKey, entity, version, this.dataSchema['tables'][tableKey].schemas[this.dataSchema['tables'][tableKey].currentSchema]['data'])
		if (!dto.success) return dto

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.add(`${tableKey}-get-${id}`, dto)
		}

		return {success: true, data: dto.data}
	}

	/**
	 * Get multiple entities, loading the current version for each.
	 *
	 * @param tableKey
	 * @param ids
	 */
	async getMany<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, ids: string[]): Promise<ActionResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>> {
		const dtos: EntityDto<CurrentSchemaData<DataSchema, TableKey>>[] = []
		const errors: ErrorObject[] = []

		for (const id of ids) {
			const dto = await this.get(tableKey, id)
			if (dto.success) {
				dtos.push(dto.data)
			} else if (dto.errors) {
				errors.push(...dto.errors)
			}
		}

		return {success: true, data: dtos, errors: errors}
	}

	/**
	 * Create a new entity.
	 * This will also create an initial version.
	 *
	 * @param tableKey
	 * @param data
	 */
	async create<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, data: CurrentSchemaData<DataSchema, TableKey>): Promise<ActionResult<string>> {
		const db = await this.getDb()

		const entityId = LocalfulEncryption.generateUUID();
		const versionId = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")
		const encryptionKey = await this.getEncryptionKey(this.currentDatabaseId)
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, data)
		if (!encResult.success) return encResult

		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const version: EntityVersion = {
			entityId: entityId,
			id: versionId,
			data: encResult.data,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			schemaVersion: this.dataSchema['tables'][tableKey].currentSchema
		}
		await tx.objectStore(this._getVersionTableName(tableKey)).add(version)

		const entity = {
			id: entityId,
			isDeleted: 0,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			currentVersionId: versionId
		}

		// Process exposed fields, and add these to the entity before saving.
		const exposedFields = this.dataSchema['tables'][tableKey].schemas[this.dataSchema['tables'][tableKey].currentSchema].exposedFields
		if (exposedFields) {
			for (const field of Object.keys(exposedFields)) {
				// @ts-expect-error - this is fine.
				entity[field] = data[field]
			}
		}

		await tx.objectStore(tableKey).add(entity)

		await tx.done

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { tableKey: tableKey, action: 'create', id: entityId})

		return { success: true, data: entityId }
	}

	/**
	 * Update the given entity.
	 * This will load the latest version, apply the given updates, and create a
	 * new version with the updates.
	 *
	 * @param tableKey
	 * @param entityId
	 * @param dataUpdate
	 * @param preventEventDispatch - UUseful in situations like data migrations, where an update is done while fetching data so an event shouldn't be triggered.
	 */
	async update<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string, dataUpdate: EntityUpdate<CurrentSchemaData<DataSchema, TableKey>>, preventEventDispatch?: boolean): Promise<ActionResult<string>> {
		const oldEntity = await this.get(tableKey, entityId)
		if (!oldEntity.success) return oldEntity

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.delete(`${tableKey}-get-${entityId}`)
			await memoryCache.delete(`${tableKey}-getAll`)
		}

		// Pick out all entity/version fields, which will leave only data fields.
		const updatedData = {
			...oldEntity.data.data,
			...dataUpdate
		}

		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")
		const encryptionKey = await this.getEncryptionKey(this.currentDatabaseId)
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, updatedData)
		if (!encResult.success) return encResult

		const versionId = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		const db = await this.getDb()
		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const newVersion: EntityVersion = {
			entityId: entityId,
			id: versionId,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			data: encResult.data,
			schemaVersion: this.dataSchema['tables'][tableKey].currentSchema
		}
		await tx.objectStore(this._getVersionTableName(tableKey)).add(newVersion)

		const updatedEntity = {
			id: oldEntity.data.id,
			createdAt: oldEntity.data.createdAt,
			isDeleted: oldEntity.data.isDeleted,
			localfulVersion: oldEntity.data.localfulVersion,
			currentVersionId: versionId
		}

		// Process exposed fields, adding them to the updated entity before saving.
		const exposedFields = this.dataSchema['tables'][tableKey].schemas[this.dataSchema['tables'][tableKey].currentSchema].exposedFields
		if (exposedFields) {
			for (const field of Object.keys(exposedFields)) {
				// @ts-expect-error - this is fine.
				updatedEntity[field] = updatedData[field]
			}
		}

		await tx.objectStore(tableKey).put(updatedEntity)

		await tx.done

		if (!preventEventDispatch) {
			this.eventManager.dispatch( EventTypes.DATA_CHANGE, { tableKey: tableKey, action: 'update', id: entityId})
		}

		return {success: true, data: versionId}
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.delete(`${tableKey}-get-${entityId}`)
			await memoryCache.delete(`${tableKey}-getAll`)
		}

		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const entityStore = tx.objectStore(tableKey)
		const currentEntity = await entityStore.get(entityId)
		const updatedEntity = {
			...currentEntity,
			isDeleted: 1
		}
		// The keypath 'id' is supplied, so no need to also supply this in the second arg
		await entityStore.put(updatedEntity)

		const versionStore = tx.objectStore(this._getVersionTableName(tableKey))
		const versionsIndex = versionStore.index('entityId')
		let deletionCursor = await versionsIndex.openCursor(entityId)
		while (deletionCursor) {
			deletionCursor.delete()
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { tableKey: tableKey, action: 'delete', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Query for content.
	 */
	async query<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>): Promise<ActionResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>> {
		// todo: add query memory cache?

		const db = await this.getDb()
		const tx = db.transaction([query.table, this._getVersionTableName(query.table)], 'readonly')

		// Pick what index and cursor query to use for the initial data selection
		// In the case of an "includes" operation on the index, there will be one index for each value.
		const indexes: QueryIndex[] = []
		if (query.index) {
			const exposedFields = this.dataSchema['tables'][query.table].schemas[this.dataSchema['tables'][query.table].currentSchema].exposedFields
			// @ts-expect-error - query.index.field will be a key of an exposed field
			if (!exposedFields || !exposedFields[query.index.field]) {
				throw new Error("Attempted to use an exposed field that does not exist.")
			}
			// @ts-expect-error - query.index.field will be a key of an exposed field
			else if (exposedFields[query.index.field] !== 'indexed') {
				throw new Error("Attempted to use an exposed fields that isn't of type 'indexed'.")
			}


			if (query.index.operation === 'equal') {
				indexes.push({
					// @ts-expect-error - query.index.field will be the name of the index
					index: tx.objectStore(query.table).index(query.index.field),
					query: IDBKeyRange.only([query.index.value, 0]) // [value, isDeleted]
				})
			}
			else if (query.index.operation === 'includes') {
				for (const value of query.index.value) {
					indexes.push({
						// @ts-expect-error - query.index.field will be the name of the index
						index: tx.objectStore(query.table).index(query.index.field),
						query: IDBKeyRange.only([value, 0]) // [value, isDeleted]
					})
				}
			}
			else {
				if (
					(typeof query.index.greaterThan !== "undefined" && typeof query.index.greaterThanEqualTo !== "undefined") ||
					(typeof query.index.lessThan !== "undefined" && typeof query.index.lessThanEqualTo !== "undefined")
				) {
					throw new Error("Attempted to use invalid combination of bounded and unbounded comparisons in query.")
				}

				let indexQuery
				if (typeof query.index.greaterThan !== "undefined" && typeof query.index.lessThan !== "undefined") {
					indexQuery = IDBKeyRange.bound([query.index.greaterThan, 0], [query.index.lessThan, 0], true, true)
				}
				else if (typeof query.index.greaterThanEqualTo !== "undefined" && typeof query.index.lessThanEqualTo !== "undefined") {
					indexQuery = IDBKeyRange.bound([query.index.greaterThan, 0], [query.index.lessThan, 0], false, false)
				}
				if (typeof query.index.greaterThan !== "undefined" && typeof query.index.lessThanEqualTo !== "undefined") {
					indexQuery = IDBKeyRange.bound([query.index.greaterThan, 0], [query.index.lessThan, 0], true, false)
				}
				if (typeof query.index.greaterThanEqualTo !== "undefined" && typeof query.index.lessThanEqualTo !== "undefined") {
					indexQuery = IDBKeyRange.bound([query.index.greaterThan, 0], [query.index.lessThan, 0], false, true)
				}
				if (typeof query.index.greaterThanEqualTo !== "undefined") {
					indexQuery = IDBKeyRange.lowerBound([query.index.greaterThanEqualTo, 0], false)
				}
				if (typeof query.index.greaterThan !== "undefined") {
					indexQuery = IDBKeyRange.lowerBound([query.index.greaterThanEqualTo, 0], true)
				}
				if (typeof query.index.lessThanEqualTo !== "undefined") {
					indexQuery = IDBKeyRange.upperBound([query.index.greaterThanEqualTo, 0], false)
				}
				if (typeof query.index.lessThan !== "undefined") {
					indexQuery = IDBKeyRange.upperBound([query.index.greaterThanEqualTo, 0], true)
				}

				indexes.push({
					// @ts-expect-error - query.index.field will be the name of the index
					index: tx.objectStore(query.table).index(query.index.field),
					query: indexQuery
				})
			}
		}
		else {
			indexes.push({
				// @ts-expect-error - this is a valid index. todo: a generics issue with QueryIndex?
				index: tx.objectStore(query.table).index('isDeleted'),
				query: 0
			})
		}

		const cursorResults: {entity: LocalEntity, version: EntityVersion}[] = []
		const errors: ErrorObject[] = []

		// Iterate over all indexes and all items in the index cursor, also running the user-supplied whereCursor function.
		for (const queryIndex of indexes) {
			for await (const entityCursor of queryIndex.index.iterate(queryIndex.query, queryIndex.direction)) {
				const entity = entityCursor.value as LocalEntityWithExposedFields<DataSchema, TableKey>
				let version: EntityVersion|undefined = undefined
				if (entity.currentVersionId) {
					version = await tx.objectStore(this._getVersionTableName(query.table)).get(entity.currentVersionId) as EntityVersion|undefined

					// Don't fall back to loading latest version as this state should never be possible and shouldn't fail silently.
					if (!version) {
						errors.push({type: ErrorTypes.VERSION_NOT_FOUND, context: entity.id})
						break
					}
				}
				else {
					const allVersions = await tx.objectStore(this._getVersionTableName(query.table)).getAll() as EntityVersion[]
					const sortedVersions = allVersions.sort((a, b) => {
						return a.createdAt < b.createdAt ? 1 : 0
					})
					if (sortedVersions[0]) {
						version = sortedVersions[0]
					}
					else {
						errors.push({type: ErrorTypes.ENTITY_WITHOUT_VERSION, context: entity.id})
						break
					}
				}

				let include = true
				if (query.whereCursor) {
					include = query.whereCursor(entity, version)
				}
				if (include) {
					cursorResults.push({entity: entity, version: version})
				}
			}
		}

		await tx.done

		const dataFilterResults: EntityDto<CurrentSchemaData<DataSchema, TableKey>>[] = []
		for (const result of cursorResults) {
			const dto = await this._createEntityVersionDto<CurrentSchemaData<DataSchema, TableKey>>(
				query.table,
				result.entity,
				result.version,
				this.dataSchema['tables'][query.table].schemas[this.dataSchema['tables'][query.table].currentSchema]['data']
			)
			if (dto.success) {
				let include = true
				if (query.whereData) {
					include = query.whereData(dto.data)
				}
				if (include) {
					dataFilterResults.push(dto.data)
				}
			}

			if (dto.errors) {
				errors.push(...dto.errors)
			}
		}

		let sortedResults
		if (query.sort) {
			sortedResults = query.sort(dataFilterResults)
		}
		else {
			sortedResults = dataFilterResults.sort((a, b) => {
				return a.updatedAt > b.updatedAt ? 1 : -1
			})
		}

		// todo: add query memory cache?

		return {
			success: true,
			data: sortedResults,
			errors: errors
		}
	}


	/**
	 * Get all versions
	 *
	 * @param tableKey
	 * @param entityId
	 */
	async getAllVersions<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult<EntityVersion[]>> {
		const db = await this.getDb()

		const versions = await db.getAllFromIndex(this._getVersionTableName(tableKey), 'entityId', entityId)
		return {success: true, data: versions}
	}

	/**
	 * Purge the given item, permanently deleting the entity and all versions.
	 * This is different to deletion, which will only delete all versions and set
	 * the 'isDeleted' flag on teh entity.
	 *
	 * @param tableKey
	 * @param entityId
	 */
	async purge<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.delete(`${tableKey}-get-${entityId}`)
			await memoryCache.delete(`${tableKey}-getAll`)
		}

		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const entityStore = tx.objectStore(tableKey)
		await entityStore.delete(entityId)

		const versionStore = tx.objectStore(this._getVersionTableName(tableKey))
		const versionsIndex = versionStore.index('entityId')
		let deletionCursor = await versionsIndex.openKeyCursor(entityId)
		while (deletionCursor) {
			deletionCursor.delete()
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { tableKey: tableKey, action: 'purge', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Delete all versions except the most recent.
	 */
	async deleteOldVersions<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		const versions = await this.getAllVersions(tableKey, entityId)
		if (!versions.success) return versions

		const sortedVersions = versions.data.sort((a, b) => {
			return a.createdAt < b.createdAt ? 1 : 0
		})
		if (!sortedVersions[0]) {
			return {success: false, errors: [{type: ErrorTypes.ENTITY_WITHOUT_VERSION, context: entityId}]}
		}

		const tx = db.transaction(this._getVersionTableName(tableKey), 'readwrite')
		const versionsIndex = tx.store.index('entityId')
		let deletionCursor = await versionsIndex.openKeyCursor(entityId)
		while (deletionCursor) {
			if (deletionCursor.key !== sortedVersions[0].id) {
				await deletionCursor.delete()
			}
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		return {success: true, data: null}
	}

	/**
	 * Delete the given version, will fail if the given version is the latest.
	 *
	 * @param tableKey
	 * @param versionId
	 */
	async deleteVersion<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, versionId: string): Promise<ActionResult> {
		const db = await this.getDb()

		await db.delete(this._getVersionTableName(tableKey), versionId)

		// todo: return error if the give version is not found?
		return {success: true, data: null}
	}

	/**
	 * Fetch a single version
	 *
	 * @param tableKey
	 * @param versionId
	 */
	async getVersion<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, versionId: string): Promise<ActionResult<EntityVersion>> {
		const db = await this.getDb()

		const version = await db.get(this._getVersionTableName(tableKey), versionId)
		if (!version) return {success: false, errors: [{type: ErrorTypes.VERSION_NOT_FOUND, context: versionId}]}

		return {success: true, data: version}
	}

	/**
	 * Fetch the entity from the entity table.
	 *
	 * @param tableKey
	 * @param entityId
	 */
	async _getEntity<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult<LocalEntity>> {
		const db = await this.getDb()

		const entity = await db.get(tableKey, entityId)

		if (!entity || entity.isDeleted === 1) {
			return {success: false, errors: [{type: ErrorTypes.ENTITY_NOT_FOUND, context: entityId}]}
		}

		return {success: true, data: entity}
	}

	observableGet<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, id: string) {
		return new Observable<Query<EntityDto<CurrentSchemaData<DataSchema, TableKey>>>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.get(tableKey, id)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				// Discard if tableKey or ID doesn't match, as the data won't have changed.
				if (e.detail.data.tableKey === tableKey && e.detail.data.id === id) {
					Logger.debug(`[observableGet] Received event that requires re-query`)
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
	
	observableGetMany<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, ids: string[]) {
		return new Observable<Query<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.getMany(tableKey, ids)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.tableKey === tableKey && ids.includes(e.detail.data.id)) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
	
	observableQuery<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>) {
		return new Observable<Query<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.query(query)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.tableKey === query.table) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
}
