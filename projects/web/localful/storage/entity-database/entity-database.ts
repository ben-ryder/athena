import {ZodTypeAny} from "zod";
import {
	ErrorTypes,
	LIVE_QUERY_LOADING_STATE,
	LiveQueryResult,
	LiveQueryStatus,
	LocalfulError,
	QueryResult
} from "../../control-flow";
import {LocalfulEncryption} from "../../encryption/encryption";
import {memoryCache} from "../memory-cache";
import {Observable} from "rxjs";
import {DataEntityChangeEvent, EventTypes} from "../../events/events";
import {IDBPDatabase, openDB} from "idb";
import {Entity, EntityCreateDto, EntityDto, EntityUpdate, EntityVersion, LocalEntity} from "../../types/data-entities";
import {EventManager} from "../../events/event-manager";
import {Logger} from "../../../src/utils/logger";
import {
	CurrentSchemaData,
	DataSchemaDefinition,
	ExportData,
	LocalEntityWithExposedFields,
	QueryDefinition,
	QueryIndex,
	TableKeys
} from "../types";
import {LOCALFUL_INDEXDB_ENTITY_VERSION, LOCALFUL_VERSION} from "../../localful-web";
import {IdField, TimestampField} from "../../types/fields";

export interface EntityDatabaseConfig {
	databaseId: string,
	encryptionKey: string,
	dataSchema: DataSchemaDefinition,
}

export interface EntityDatabaseDependencies {
	eventManager: EventManager
}

export class EntityDatabase<DataSchema extends DataSchemaDefinition> {
	databaseId: string
	private readonly encryptionKey: string
	private readonly dataSchema: DataSchemaDefinition
	private _database?: IDBPDatabase
	private readonly eventManager: EventManager

	constructor(
		config: EntityDatabaseConfig,
		deps: EntityDatabaseDependencies
	) {
		this.databaseId = config.databaseId
		this.dataSchema = config.dataSchema
		this.eventManager = deps.eventManager
		this.encryptionKey = config.encryptionKey
	}

	private async getIndexDbDatabase() {
		if (this._database) {
			return this._database
		}

		this.eventManager.dispatch(EventTypes.DATABASE_OPEN, {id: this.databaseId})
		this._database = await openDB(this.databaseId, LOCALFUL_INDEXDB_ENTITY_VERSION, {
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

		return this._database
	}

	async close() {
		if (this._database) {
			this._database.close()
			delete this._database
		}
		this.eventManager.dispatch(EventTypes.DATABASE_CLOSE, {id: this.databaseId})
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
	async _createEntityVersionDto<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entity: Entity, version: EntityVersion, dataSchema: ZodTypeAny): Promise<EntityDto<CurrentSchemaData<DataSchema, TableKey>>> {
		let data
		try {
			data = await LocalfulEncryption.decrypt<CurrentSchemaData<DataSchema, TableKey>>(
				this.encryptionKey,
				version.data,
				dataSchema
			)
		}
		catch (e) {
			throw new LocalfulError({type: ErrorTypes.INVALID_PASSWORD_OR_KEY, originalError: e})
		}

		if (version.schemaVersion !== this.dataSchema['tables'][tableKey].currentSchema) {
			if (!this.dataSchema['tables'][tableKey].migrateSchema) {
				throw new Error(`Schema migration required from ${version.schemaVersion} to ${this.dataSchema['tables'][tableKey].currentSchema} but no migrateSchema method supplied`)
			}

			// @ts-expect-error - the existence of migrateSchema is checked above, and passing this is fine.
			data = await this.dataSchema[tableKey].migrateSchema(this, version.schemaVersion, this.dataSchema[tableKey].currentSchema, decryptedData.data)
			await this.update(tableKey, entity.id, data)
		}

		return {
			id: entity.id,
			versionId: version.id,
			createdAt: entity.createdAt,
			updatedAt: version.createdAt,
			data: data,
			localfulVersion: entity.localfulVersion,
			schemaVersion: version.schemaVersion,
			isDeleted: entity.isDeleted,
		}
	}

	/**
	 * Get a single entity, loading the current version.
	 *
	 * @param tableKey
	 * @param id
	 */
	async get<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, id: string): Promise<EntityDto<CurrentSchemaData<DataSchema, TableKey>>> {
		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			const cachedResponse = await memoryCache.get<CurrentSchemaData<DataSchema, TableKey>>(`${tableKey}-get-${id}`)
			if (cachedResponse) {
				return cachedResponse
			}
		}

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readonly')
		const entity = await tx.objectStore(tableKey).get(id) as LocalEntity|undefined
		if (!entity) {
			throw new LocalfulError({type: ErrorTypes.ENTITY_NOT_FOUND, devMessage: `entity ${id} could not be found.`})
		}

		let version: EntityVersion|undefined = undefined
		if (entity.currentVersionId) {
			version = await tx.objectStore(this._getVersionTableName(tableKey)).get(entity.currentVersionId) as EntityVersion|undefined

			// Don't fall back to loading latest version as this state should never be possible and shouldn't fail silently.
			if (!version) {
				throw new LocalfulError({type: ErrorTypes.VERSION_NOT_FOUND, devMessage: `entity ${id} has no currentVersionId set`})
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
				throw new LocalfulError({type: ErrorTypes.VERSION_NOT_FOUND, devMessage: `entity ${id} has no versions`})
			}
		}

		await tx.done

		const dto = await this._createEntityVersionDto<CurrentSchemaData<DataSchema, TableKey>>(tableKey, entity, version, this.dataSchema['tables'][tableKey].schemas[this.dataSchema['tables'][tableKey].currentSchema]['data'])

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.add(`${tableKey}-get-${id}`, dto)
		}

		return dto
	}

	/**
	 * Get multiple entities, loading the current version for each.
	 *
	 * @param tableKey
	 * @param ids
	 */
	async getMany<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, ids: string[]): Promise<QueryResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>> {
		const dtos: EntityDto<CurrentSchemaData<DataSchema, TableKey>>[] = []
		const errors: unknown[] = []

		for (const id of ids) {
			try {
				const dto = await this.get(tableKey, id)
				dtos.push(dto)
			}
			catch (e) {
				errors.push(e)
			}
		}

		return {result: dtos, errors: errors}
	}

	/**
	 * Create a new entity.
	 * This will generate ids and timestamps before using ._create to actually create tne entity.
	 *
	 * @param tableKey
	 * @param data
	 */
	async create<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, data: CurrentSchemaData<DataSchema, TableKey>): Promise<string> {
		const entityId = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		await this._create(tableKey, {
			id: entityId,
			isDeleted: 0,
			createdAt: timestamp,
			updatedAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			schemaVersion: this.dataSchema['tables'][tableKey].currentSchema,
			data,
		})

		return entityId
	}

	/**
	 * The base method for creating new entities which is shared by both .create and .import.
	 *
	 * @param tableKey
	 * @param entityCreateDto
	 */
	private async _create<TableKey extends TableKeys<DataSchema>>(
		tableKey: TableKey,
		entityCreateDto: EntityCreateDto<CurrentSchemaData<DataSchema, TableKey>>
	): Promise<void> {
		const db = await this.getIndexDbDatabase()

		const versionId = LocalfulEncryption.generateUUID();
		const encResult = await LocalfulEncryption.encrypt(this.encryptionKey, entityCreateDto.data)

		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const version: EntityVersion = {
			entityId: entityCreateDto.id,
			id: versionId,
			data: encResult,
			createdAt: entityCreateDto.createdAt,
			localfulVersion: entityCreateDto.localfulVersion,
			schemaVersion: entityCreateDto.schemaVersion
		}
		await tx.objectStore(this._getVersionTableName(tableKey)).add(version)

		const entity = {
			id: entityCreateDto.id,
			isDeleted: 0,
			createdAt: entityCreateDto.updatedAt,
			localfulVersion: entityCreateDto.localfulVersion,
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

		this.eventManager.dispatch( EventTypes.DATA_ENTITY_CHANGE, { databaseId: this.databaseId, tableKey: tableKey, action: 'create', id: entityCreateDto.id})

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
	async update<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string, dataUpdate: EntityUpdate<CurrentSchemaData<DataSchema, TableKey>>, preventEventDispatch?: boolean): Promise<string> {
		const oldEntity = await this.get(tableKey, entityId)

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.delete(`${tableKey}-get-${entityId}`)
			await memoryCache.delete(`${tableKey}-getAll`)
		}

		// Pick out all entity/version fields, which will leave only data fields.
		const updatedData = {
			...oldEntity.data,
			...dataUpdate
		}

		const encResult = await LocalfulEncryption.encrypt(this.encryptionKey, updatedData)

		const versionId = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')

		const newVersion: EntityVersion = {
			entityId: entityId,
			id: versionId,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			data: encResult,
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
			this.eventManager.dispatch( EventTypes.DATA_ENTITY_CHANGE, { databaseId: this.databaseId, tableKey: tableKey, action: 'update', id: entityId})
		}

		return versionId
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<void> {
		const currentEntity = await this.get(tableKey, entityId)

		const db = await this.getIndexDbDatabase()

		if (this.dataSchema['tables'][tableKey].useMemoryCache) {
			await memoryCache.delete(`${tableKey}-get-${entityId}`)
			await memoryCache.delete(`${tableKey}-getAll`)
		}

		const tx = db.transaction([tableKey, this._getVersionTableName(tableKey)], 'readwrite')
		const entityStore = tx.objectStore(tableKey)

		const updatedEntity: LocalEntity = {
			id: currentEntity.data.id,
			createdAt: currentEntity.data.createdAt,
			localfulVersion: currentEntity.data.localfulVersion,
			currentVersionId: currentEntity.data.versionId,
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

		this.eventManager.dispatch( EventTypes.DATA_ENTITY_CHANGE, { databaseId: this.databaseId, tableKey: tableKey, action: 'delete', id: entityId})
	}

	/**
	 * Query for content.
	 */
	async query<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>): Promise<QueryResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>> {
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
		const errors: unknown[] = []

		// Iterate over all indexes and all items in the index cursor, also running the user-supplied whereCursor function.
		for (const queryIndex of indexes) {
			for await (const entityCursor of queryIndex.index.iterate(queryIndex.query, queryIndex.direction)) {
				const entity = entityCursor.value as LocalEntityWithExposedFields<DataSchema, TableKey>
				let version: EntityVersion|undefined = undefined
				if (entity.currentVersionId) {
					version = await tx.objectStore(this._getVersionTableName(query.table)).get(entity.currentVersionId) as EntityVersion|undefined

					// Don't fall back to loading latest version as this state should never be possible and shouldn't fail silently.
					if (!version) {
						errors.push(new LocalfulError({type: ErrorTypes.VERSION_NOT_FOUND, devMessage: `entity ${entity.id} has no currentVersionId set`}))
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
						errors.push(new LocalfulError({type: ErrorTypes.VERSION_NOT_FOUND, devMessage: `entity ${entity.id} has no versions`}))
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

			// Run any defined whereData queries.
			let includeInResults = true
			if (query.whereData) {
				includeInResults = query.whereData(dto)
			}

			if (includeInResults) {
				dataFilterResults.push(dto)
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
			result: sortedResults,
			errors: errors
		}
	}


	/**
	 * Get all versions
	 *
	 * @param tableKey
	 * @param entityId
	 */
	async getAllVersions<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<EntityVersion[]> {
		const db = await this.getIndexDbDatabase()

		return await db.getAllFromIndex(this._getVersionTableName(tableKey), 'entityId', entityId)
	}

	/**
	 * Delete all versions except the most recent.
	 */
	async deleteOldVersions<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<void> {
		const db = await this.getIndexDbDatabase()

		const versions = await this.getAllVersions(tableKey, entityId)

		const sortedVersions = versions.sort((a, b) => {
			return a.createdAt < b.createdAt ? 1 : 0
		})
		if (!sortedVersions[0]) {
			throw new LocalfulError({type: ErrorTypes.VERSION_NOT_FOUND, devMessage: `entity ${entityId} has no versions`})
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
	}

	/**
	 * Delete the given version, will fail if the given version is the latest.
	 *
	 * @param tableKey
	 * @param versionId
	 */
	async deleteVersion<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, versionId: string): Promise<void> {
		const db = await this.getIndexDbDatabase()
		await db.delete(this._getVersionTableName(tableKey), versionId)
	}

	/**
	 * Fetch a single version
	 *
	 * @param tableKey
	 * @param versionId
	 */
	async getVersion<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, versionId: string): Promise<EntityVersion> {
		const db = await this.getIndexDbDatabase()
		return await db.get(this._getVersionTableName(tableKey), versionId)
	}

	/**
	 * Fetch the entity from the entity table.
	 *
	 * @param tableKey
	 * @param entityId
	 */
	async _getEntity<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, entityId: string): Promise<LocalEntity> {
		const db = await this.getIndexDbDatabase()

		const entity = await db.get(tableKey, entityId)

		if (!entity || entity.isDeleted === 1) {
			throw new LocalfulError({type: ErrorTypes.ENTITY_NOT_FOUND, devMessage: `entity ${entityId} could not be found`})
		}

		return entity
	}

	liveGet<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, id: string) {
		return new Observable<LiveQueryResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>>>((subscriber) => {
			subscriber.next(LIVE_QUERY_LOADING_STATE)

			const runQuery = async () => {
				subscriber.next(LIVE_QUERY_LOADING_STATE)

				try {
					const dto = await this.get(tableKey, id)
					subscriber.next({status: LiveQueryStatus.SUCCESS, result: dto})
				}
				catch (e) {
					subscriber.next({status: LiveQueryStatus.ERROR, errors: [e]})
				}
			}

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				// Discard if tableKey or ID doesn't match, as the data won't have changed.
				if (e.detail.data.databaseId === this.databaseId && e.detail.data.tableKey === tableKey && e.detail.data.id === id) {
					Logger.debug(`[observableGet] Received event that requires re-query`)
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			}
		})
	}
	
	liveGetMany<TableKey extends TableKeys<DataSchema>>(tableKey: TableKey, ids: string[]) {
		return new Observable<LiveQueryResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>>((subscriber) => {
			subscriber.next(LIVE_QUERY_LOADING_STATE)

			const runQuery = async () => {
				subscriber.next(LIVE_QUERY_LOADING_STATE)

				try {
					const query = await this.getMany(tableKey, ids)
					subscriber.next({status: LiveQueryStatus.SUCCESS, result: query.result, errors: query.errors})
				}
				catch (e) {
					subscriber.next({status: LiveQueryStatus.ERROR, errors: [e]})
				}
			}

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				if (e.detail.data.databaseId === this.databaseId && e.detail.data.tableKey === tableKey && ids.includes(e.detail.data.id)) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			}
		})
	}

	liveQuery<TableKey extends TableKeys<DataSchema>>(query: QueryDefinition<DataSchema, TableKey>) {
		return new Observable<LiveQueryResult<EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]>>((subscriber) => {
			subscriber.next(LIVE_QUERY_LOADING_STATE)

			const runQuery = async () => {
				subscriber.next(LIVE_QUERY_LOADING_STATE)

				try {
					const queryResult = await this.query(query)
					subscriber.next({status: LiveQueryStatus.SUCCESS, result: queryResult.result, errors: queryResult.errors})
				}
				catch (e) {
					subscriber.next({status: LiveQueryStatus.ERROR, errors: [e]})
				}
			}

			const handleEvent = (e: CustomEvent<DataEntityChangeEvent['detail']>) => {
				if (e.detail.data.databaseId === this.databaseId && e.detail.data.tableKey === query.table) {
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATA_ENTITY_CHANGE, handleEvent)
			}
		})
	}

	async export(): Promise<ExportData<DataSchema>> {
		const entityKeys = Object.keys(this.dataSchema.tables)

		const exportData: ExportData<DataSchema> = {
			exportVersion: 'v1',
			data: {}
		}

		for (const entityKey of entityKeys) {
			const allDataQuery = await this.query({table: entityKey})

			const exportEntities = allDataQuery.result.map(dto => {
				return {
					id: dto.id,
					localfulVersion: dto.localfulVersion,
					schemaVersion: dto.schemaVersion,
					createdAt: dto.createdAt,
					updatedAt: dto.updatedAt,
					data: dto.data,
				}
			})

			// @ts-expect-error -- just disable Typescript here, don't have the will power to get it to work :D
			exportData.data[entityKey] = exportEntities
		}

		return exportData
	}

	async import(importData: ExportData<DataSchema>): Promise<void> {
		if (importData.exportVersion !== 'v1') {
			throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: "Unrecognized or missing export version"})
		}

		if (!importData.data) {
			throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: "Unrecognized or missing export data"})
		}

		const validTableKeys = Object.keys(this.dataSchema.tables)
		const importTableKeys = Object.keys(importData.data)
		for (const importTableKey of importTableKeys) {
			if (!validTableKeys.includes(importTableKey)) {
				throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Unrecognized table ${importTableKey} in import data`})
			}

			if (!Array.isArray(importData.data[importTableKey])) {
				throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Invalid table ${importTableKey} in import data`})
			}
		}

		for (const importTableKey of importTableKeys) {
			// @ts-expect-error -- we have checked that importData.data is not null and that the table is an array.
			for (const entityToImport of importData.data[importTableKey]) {
				let id
				let createdAt
				let updatedAt
				try {
					id = IdField.parse(entityToImport.id)
					createdAt = TimestampField.parse(entityToImport.createdAt)
					updatedAt = TimestampField.parse(entityToImport.updatedAt)
				}
				catch (e) {
					throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Invalid entity data for ${importTableKey} entity ${entityToImport.id}`, originalError: e})
				}

				if (entityToImport.localfulVersion !== LOCALFUL_VERSION) {
					throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Unrecognised Localful version ${entityToImport.localfulVersion} for ${importTableKey} entity ${entityToImport.id}`})
				}

				const validSchemaKeys = Object.keys(this.dataSchema.tables[importTableKey].schemas)
				if (!validSchemaKeys.includes(entityToImport.schemaVersion)) {
					throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Unrecognised schema version ${entityToImport.schemaVersion} for ${importTableKey} entity ${entityToImport.id}`})
				}

				let dataToImport
				try {
					dataToImport = this.dataSchema.tables[importTableKey].schemas[entityToImport.schemaVersion].data.parse(entityToImport.data)
				}
				catch (e) {
					throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Data for ${importTableKey} entity ${entityToImport.id} failed validation`, originalError: e})
				}

				if (entityToImport.schemaVersion !== this.dataSchema.tables[importTableKey].currentSchema) {
					if (!this.dataSchema.tables[importTableKey].migrateSchema) {
						throw new LocalfulError({
							type: ErrorTypes.SYSTEM_ERROR,
							devMessage: `${importTableKey} entity ${entityToImport.id} required schema migration from ${entityToImport.schemaVersion} to ${this.dataSchema.tables[importTableKey].currentSchema} but no migration method was provided`,
						})
					}
					try {
						// @ts-expect-error -- we have checked that migrateSchema exists above
						dataToImport = this.dataSchema.tables[importTableKey].migrateSchema(this, entityToImport.schemaVersion, this.dataSchema.tables[importTableKey].currentSchema, entityToImport.data)
					}
					catch (e) {
						throw new LocalfulError({
							type: ErrorTypes.SYSTEM_ERROR,
							devMessage: `Error occurred during schema migration for ${importTableKey} entity ${entityToImport.id}. Attempted migration was ${entityToImport.schemaVersion} to ${this.dataSchema.tables[importTableKey].currentSchema}.`,
						})
					}
				}

				// Ensure that the item doesn't already exist
				let existingItem
				try {
					existingItem = await this.get(importTableKey, entityToImport.id)
				}
				catch (e) {
					if (e instanceof LocalfulError && e.cause.type !== ErrorTypes.ENTITY_NOT_FOUND) {
						throw new LocalfulError({type: ErrorTypes.SYSTEM_ERROR, originalError: e, devMessage: `Error occurred while attempting to check if ${importTableKey} entity ${entityToImport.id} exists. `})
					}
				}
				if (existingItem) {
					throw new LocalfulError({type: ErrorTypes.INVALID_OR_CORRUPTED_DATA, devMessage: `Attempted to import ${importTableKey} entity ${entityToImport.id} which already exists`})
				}

				try {
					await this._create(importTableKey, {
						id,
						createdAt,
						updatedAt,
						isDeleted: 0,
						localfulVersion: entityToImport.localfulVersion,
						// Schema will have always migrated to current schema at this point,
						schemaVersion: this.dataSchema.tables[importTableKey].currentSchema,
						data: dataToImport
					})
					console.debug(`Created ${importTableKey} entity ${entityToImport.id}`)
				}
				catch (e) {
					throw new LocalfulError({
						type: ErrorTypes.SYSTEM_ERROR,
						devMessage: `Error occurred while attempting to create ${importTableKey} entity ${entityToImport.id}.`,
						originalError: e,
					})
				}
			}
		}
	}
}
