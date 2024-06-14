import {ZodTypeAny} from "zod";
import {ActionResult, ErrorObject, ErrorTypes, Query, QUERY_LOADING, QueryStatus} from "../control-flow";
import {LocalfulEncryption} from "../encryption/localful-encryption";
import {memoryCache} from "./memory-cache";
import {Observable} from "rxjs";
import {DataEntityChangeEvent, EventTypes} from "../events/events";
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
import {LOCALFUL_INDEXDB_DATABASE_VERSION, LOCALFUL_VERSION} from "../localful-web";
import {DatabaseFields, LocalDatabaseDto, LocalDatabaseEntity, LocalDatabaseFields} from "../types/database";

export interface DatabaseStorageDependencies {
	eventManager: EventManager
}

export class DatabaseStorage {
	private readonly _database?: IDBPDatabase
	private readonly eventManager: EventManager

	constructor(
		deps: DatabaseStorageDependencies
	) {
		this.eventManager = deps.eventManager
	}

	private async getIndexDbDatabase() {
		if (this._database) {
			return this._database
		}

		return openDB('localful', LOCALFUL_INDEXDB_DATABASE_VERSION, {
			// todo: handle upgrades to existing database versions
			upgrade: (db) => {
				// Create database store
				const entityStore = db.createObjectStore('databases', {
					keyPath: 'id',
					autoIncrement: false
				})
				entityStore.createIndex('isDeleted', 'isDeleted')
				entityStore.createIndex('createdAt', ['createdAt', 'isDeleted'])
				entityStore.createIndex('syncEnabled', ['syncEnabled', 'isDeleted'])
			},
		})
	}

	async unlockDatabase(databaseId: string, password: string): Promise<boolean> {
		return false;
	}

	/**
	 * Get a single database
	 *
	 * @param id
	 */
	async get(id: string): Promise<ActionResult<LocalDatabaseDto>> {
		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readonly')
		const entity = await tx.objectStore('databases').get(id) as LocalDatabaseEntity|undefined
		if (!entity) {
			return {success: false, errors: [{type: ErrorTypes.DATABASE_NOT_FOUND, context: id}]}
		}
		await tx.done

		// todo: attempt to load encryption key, and set isUnlocked based on being able to load the key

		const databaseDto: LocalDatabaseDto = {
			...entity,
			isUnlocked: true
		}

		return {success: true, data: databaseDto}
	}

	/**
	 * Create a new database.
	 *
	 * @param data
	 * @param password
	 */
	async create(data: LocalDatabaseFields, password: string): Promise<ActionResult<string>> {
		const db = await this.getIndexDbDatabase()

		const id = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		// create encryptionKey
		// derive unlock key (KEK) from password
		// create protectedEncryptionKey, which is the encryptionKey encrypted with the unlock key

		const tx = db.transaction(['databases'], 'readwrite')

		const database: LocalDatabaseEntity = {
			id: id,
			name: data.name,
			protectedEncryptionKey: password,
			protectedData: undefined,
			createdAt: timestamp,
			updatedAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			syncEnabled: data.syncEnabled
		}
		await tx.objectStore('databases').add(database)

		await tx.done

		this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: id, action: 'create'})

		return { success: true, data: id }
	}

	/**
	 * Update the given entity.
	 * This will load the latest version, apply the given updates, and create a
	 * new version with the updates.
	 *
	 * @param databaseId
	 * @param dataUpdate
	 * @param preventEventDispatch - Useful in situations like data migrations, where an update is done while fetching data so an event shouldn't be triggered.
	 */
	async update(databaseId: string, dataUpdate: Partial<DatabaseFields>, preventEventDispatch?: boolean): Promise<ActionResult<void>> {
		const oldDatabase = await this.get(databaseId)
		if (!oldDatabase.success) return oldDatabase

		const timestamp = new Date().toISOString();

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readwrite')

		const newDatabase: LocalDatabaseEntity = {
			...oldDatabase,
			...dataUpdate,
			updatedAt: timestamp
		}
		await tx.objectStore('databases').put(newDatabase)

		await tx.done

		if (!preventEventDispatch) {
			this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: databaseId, action: 'update' })
		}

		return {success: true, data: undefined}
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<ActionResult> {
		const db = await this.getIndexDbDatabase()

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

		this.eventManager.dispatch( EventTypes.DATA_ENTITY_CHANGE, { tableKey: tableKey, action: 'delete', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Query for content.
	 */
	async query<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>): Promise<ActionResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>> {
		// todo: add query memory cache?

		const db = await this.getIndexDbDatabase()
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
		const db = await this.getIndexDbDatabase()

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
		const db = await this.getIndexDbDatabase()

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

		this.eventManager.dispatch( EventTypes.DATA_ENTITY_CHANGE, { tableKey: tableKey, action: 'purge', id: entityId})

		return {success: true, data: null}
	}

	liveGet<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, id: string) {
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

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				// Discard if tableKey or ID doesn't match, as the data won't have changed.
				if (e.detail.data.tableKey === tableKey && e.detail.data.id === id) {
					Logger.debug(`[observableGet] Received event that requires re-query`)
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_CLOSE, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_CLOSE, runQuery)
			}
		})
	}

	liveGetMany<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, ids: string[]) {
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

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				if (e.detail.data.tableKey === tableKey && ids.includes(e.detail.data.id)) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_CLOSE, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_CLOSE, runQuery)
			}
		})
	}

	liveQuery<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>) {
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

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				if (e.detail.data.tableKey === query.table) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_CLOSE, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_CLOSE, runQuery)
			}
		})
	}
}
