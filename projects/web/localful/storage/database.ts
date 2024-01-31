import { z, ZodTypeAny } from "zod";
import { ActionResult, ErrorObject, ErrorTypes, Query, QUERY_LOADING, QueryStatus } from "../control-flow";
import { LocalfulEncryption } from "../encryption/localful-encryption";
import { memoryCache } from "./memory-cache";
import { Observable } from "rxjs";
import { DataChangeEvent, EventTypes } from "../events/events";
import { IDBPDatabase, openDB } from "idb";
import { Entity, EntityDto, EntityUpdate, EntityVersion } from "@localful-athena/storage/entity-types";
import { EventManager } from "@localful-athena/events/event-manager";

const LOCALFUL_INDEXDB_VERSION = 1
const LOCALFUL_VERSION = '1.0'

export type EntityKeys<DataSchema> = keyof DataSchema & string
export type SchemaKeys<DataSchema extends DataSchemaDefinition, EntityKey extends keyof DataSchema> = keyof DataSchema[EntityKey]['schemas']
export type SchemaVersion<DataSchema extends DataSchemaDefinition, EntityKey extends keyof DataSchema, SchemaVersion extends keyof DataSchema[EntityKey]['schemas']> = DataSchema[EntityKey]['schemas'][SchemaVersion]
export type CurrentSchema<DataSchema extends DataSchemaDefinition, EntityKey extends keyof DataSchema> = SchemaVersion<DataSchema, EntityKey, DataSchema[EntityKey]['currentSchema']>


export type DataMigration<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends keyof DataSchema, 
	CurrentSchemaKey extends SchemaKeys<DataSchema, EntityKey>,
	TargetSchemaKey extends SchemaKeys<DataSchema, EntityKey>,
> = (
	db: LocalfulDatabase<DataSchema>,
	currentSchema: CurrentSchemaKey, targetSchema: TargetSchemaKey,
	data: SchemaVersion<DataSchema, EntityKey, CurrentSchemaKey>
) => Promise<SchemaVersion<DataSchema, EntityKey, TargetSchemaKey>>

export interface DataSchemaDefinition {
	[key: string]: {
		currentSchema: string
		schemas: {
			[key: string]: ZodTypeAny
		}
		migrateSchema?: DataMigration<never, never, never, never>
		useMemoryCache?: boolean
	}
}

export interface LocalfulDatabaseConfig {
	dataSchema: DataSchemaDefinition,
	getEncryptionKey: (databaseId: string) => Promise<CryptoKey>
	eventManager: EventManager
}

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
			upgrade: (db) => {
				for (const [entityKey] of Object.entries(this.dataSchema)) {
					// Create Entity Store
					const entityStore = db.createObjectStore(entityKey, {
						keyPath: 'id',
						autoIncrement: false
					})
					entityStore.createIndex('isDeleted', 'isDeleted')
					entityStore.createIndex('createdAt', 'createdAt')

					// Create Entity Version Store
					const entityVersionStore = db.createObjectStore(this._getVersionTableName(entityKey), {
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
		indexedDB.deleteDatabase(databaseId)
	}
	
	private _getVersionTableName(entityKey: string): string {
		return `${entityKey}_versions`
	}

	/**
	 * Create a DTO object from the given entity and version.
	 *
	 * @param entityKey
	 * @param entity
	 * @param version
	 * @param dataSchema
	 */
	async _createEntityVersionDto<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entity: Entity, version: EntityVersion, dataSchema: ZodTypeAny): Promise<ActionResult<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>>> {
		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")
		const encryptionKey = await this.getEncryptionKey(this.currentDatabaseId)

		const decryptedData = await LocalfulEncryption.decryptAndValidateData<z.infer<CurrentSchema<DataSchema, EntityKey>>>(
			encryptionKey,
			dataSchema,
			version.data
		)
		if (!decryptedData.success) return decryptedData

		let data = decryptedData.data
		if (version.schemaVersion !== this.dataSchema[entityKey].currentSchema) {
			if (!this.dataSchema[entityKey].migrateSchema) {
				throw new Error(`Schema migration required from ${version.schemaVersion} to ${this.dataSchema[entityKey].currentSchema} but no migrateSchema method supplied`)
			}

			// @ts-expect-error - the existence of migrateSchema is checked above, and passing this is fine.
			data = await this.dataSchema[entityKey].migrateSchema(this, version.schemaVersion, this.dataSchema[entityKey].currentSchema, decryptedData.data)
			await this.update(entityKey, entity.id, data)
		}

		return {
			success: true,
			data: {
				id: entity.id,
				createdAt: entity.createdAt,
				versionId: version.id,
				updatedAt: version.createdAt,
				data: data
			}
		}
	}

	/**
	 * Get a single entity, loading the current version.
	 *
	 * @param entityKey
	 * @param id
	 */
	async get<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, id: string): Promise<ActionResult<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>>> {
		if (this.dataSchema[entityKey].useMemoryCache) {
			const cachedResponse = await memoryCache.get<z.infer<CurrentSchema<DataSchema, EntityKey>>>(`${entityKey}-get-${id}`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse}
			}
		}

		const entity = await this.getEntity(entityKey, id)
		if (!entity.success) return entity

		const versions = await this.getAllVersions(entityKey, id)
		if (!versions.success) return versions

		const latestVersion = await this.getLatestVersion(versions.data)
		if (!latestVersion.success) return latestVersion

		const dto = await this._createEntityVersionDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>(entityKey, entity.data, latestVersion.data, this.dataSchema[entityKey].schemas[this.dataSchema[entityKey].currentSchema])
		if (!dto.success) return dto

		if (this.dataSchema[entityKey].useMemoryCache) {
			await memoryCache.add(`${entityKey}-get-${id}`, dto)
		}

		return {success: true, data: dto.data}
	}

	/**
	 * Get multiple entities, loading the current version for each.
	 *
	 * @param entityKey
	 * @param ids
	 */
	async getMany<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, ids: string[]): Promise<ActionResult<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[]>> {
		const dtos: EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[] = []
		const errors: ErrorObject[] = []

		for (const id of ids) {
			const dto = await this.get(entityKey, id)
			if (dto.success) {
				dtos.push(dto.data)
			} else if (dto.errors) {
				errors.push(...dto.errors)
			}
		}

		return {success: true, data: dtos, errors: errors}
	}

	/**
	 * Get all, fetching the latest version for each entity.
	 */
	async getAll<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey): Promise<ActionResult<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[]>> {
		const db = await this.getDb()

		if (this.dataSchema[entityKey].useMemoryCache) {
			const cachedResponse = await memoryCache.get<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[]>(`${entityKey}-getAll`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse}
			}
		}

		const entities = await db.getAllFromIndex(entityKey, 'isDeleted', 0)

		const dtos: EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[] = []
		const errors: ErrorObject[] = []

		for (const entity of entities) {
			const versions = await this.getAllVersions(entityKey, entity.id)
			if (!versions.success) {
				errors.push(...versions.errors)
				continue
			}
			const latestVersion = await this.getLatestVersion(versions.data)
			if (!latestVersion.success) {
				errors.push(...latestVersion.errors)
				continue
			}

			const dto = await this._createEntityVersionDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>(entityKey, entity, latestVersion.data, this.dataSchema[entityKey].schemas[this.dataSchema[entityKey].currentSchema])
			if (!dto.success) {
				errors.push(...dto.errors)
				continue
			}

			dtos.push(dto.data)
		}

		if (this.dataSchema[entityKey].useMemoryCache) {
			await memoryCache.add(`${entityKey}-getAll`, dtos)
		}

		return {
			success: true,
			data: dtos,
			errors: errors
		}
	}

	/**
	 * Create a new entity.
	 * This will also create an initial version.
	 *
	 * @param entityKey
	 * @param data
	 */
	async create<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, data: z.infer<CurrentSchema<DataSchema, EntityKey>>): Promise<ActionResult<string>> {
		const db = await this.getDb()

		const entityId = await LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		if (!this.currentDatabaseId) throw new Error("Attempted to use database features but there is not active database")
		const encryptionKey = await this.getEncryptionKey(this.currentDatabaseId)
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, data)
		if (!encResult.success) return encResult

		const entityData: Entity = {
			id: entityId,
			isDeleted: 0,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION
		}
		await db.add(entityKey, entityData)

		const versionId = await LocalfulEncryption.generateUUID();
		const versionData: EntityVersion = {
			entityId: entityId,
			id: versionId,
			data: encResult.data,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			schemaVersion: this.dataSchema[entityKey].currentSchema
		}
		await db.add(this._getVersionTableName(entityKey), versionData)

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: entityKey, action: 'create', id: entityId})

		return { success: true, data: entityId }
	}

	/**
	 * Update the given entity.
	 * This will load the latest version, apply the given updates, and create a
	 * new version with the updates.
	 *
	 * @param entityKey
	 * @param entityId
	 * @param dataUpdate
	 * @param preventEventDispatch - UUseful in situations like data migrations, where an update is done while fetching data so an event shouldn't be triggered.
	 */
	async update<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string, dataUpdate: EntityUpdate<z.infer<CurrentSchema<DataSchema, EntityKey>>>, preventEventDispatch?: boolean): Promise<ActionResult<string>> {
		const db = await this.getDb()

		const oldEntity = await this.get(entityKey, entityId)
		if (!oldEntity.success) return oldEntity

		if (this.dataSchema[entityKey].useMemoryCache) {
			await memoryCache.delete(`${entityKey}-get-${entityId}`)
			await memoryCache.delete(`${entityKey}-getAll`)
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

		const versionId = await LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();
		const versionData: EntityVersion = {
			entityId: entityId,
			id: versionId,
			createdAt: timestamp,
			localfulVersion: LOCALFUL_VERSION,
			data: encResult.data,
			schemaVersion: this.dataSchema[entityKey].currentSchema
		}

		await db.add(this._getVersionTableName(entityKey), versionData)

		if (!preventEventDispatch) {
			this.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: entityKey, action: 'update', id: entityId})
		}

		return {success: true, data: versionId}
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		if (this.dataSchema[entityKey].useMemoryCache) {
			await memoryCache.delete(`${entityKey}-get-${entityId}`)
			await memoryCache.delete(`${entityKey}-getAll`)
		}

		const tx = db.transaction([entityKey, this._getVersionTableName(entityKey)], 'readwrite')

		const entityStore = tx.objectStore(entityKey)
		const currentEntity = await entityStore.get(entityId)
		const updatedEntity = {
			...currentEntity,
			isDeleted: 1
		}
		// The keypath 'id' is supplied, so no need to also supply this in the second arg
		await entityStore.put(updatedEntity)

		const versionStore = tx.objectStore(this._getVersionTableName(entityKey))
		const versionsIndex = versionStore.index('entityId')
		let deletionCursor = await versionsIndex.openCursor(entityId)
		while (deletionCursor) {
			deletionCursor.delete()
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: entityKey, action: 'delete', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Get all versions
	 *
	 * @param entityKey
	 * @param entityId
	 */
	async getAllVersions<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string): Promise<ActionResult<EntityVersion[]>> {
		const db = await this.getDb()

		const versions = await db.getAllFromIndex(this._getVersionTableName(entityKey), 'entityId', entityId)
		return {success: true, data: versions}
	}

	/**
	 * Fetch the entity from the entity table.
	 *
	 * @param entityKey
	 * @param entityId
	 */
	async getEntity<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string): Promise<ActionResult<Entity>> {
		const db = await this.getDb()

		const entity = await db.get(entityKey, entityId)

		if (!entity || entity.isDeleted === 1) {
			return {success: false, errors: [{type: ErrorTypes.ENTITY_NOT_FOUND, context: entityId}]}
		}

		return {success: true, data: entity}
	}

	/**
	 * Purge the given item, permanently deleting the entity and all versions.
	 * This is different to deletion, which will only delete all versions and set
	 * the 'isDeleted' flag on teh entity.
	 *
	 * @param entityKey
	 * @param entityId
	 */
	async purge<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		if (this.dataSchema[entityKey].useMemoryCache) {
			await memoryCache.delete(`${entityKey}-get-${entityId}`)
			await memoryCache.delete(`${entityKey}-getAll`)
		}

		const tx = db.transaction([entityKey, this._getVersionTableName(entityKey)], 'readwrite')

		const entityStore = tx.objectStore(entityKey)
		await entityStore.delete(entityId)

		const versionStore = tx.objectStore(this._getVersionTableName(entityKey))
		const versionsIndex = versionStore.index('entityId')
		let deletionCursor = await versionsIndex.openKeyCursor(entityId)
		while (deletionCursor) {
			deletionCursor.delete()
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		this.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: entityKey, action: 'purge', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Delete all versions except the most recent.
	 */
	async deleteOldVersions<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, entityId: string): Promise<ActionResult> {
		const db = await this.getDb()

		const versions = await this.getAllVersions(entityKey, entityId)
		if (!versions.success) return versions

		const latestVersion = await this.getLatestVersion(versions.data)
		if (!latestVersion.success) return latestVersion

		const tx = db.transaction(this._getVersionTableName(entityKey), 'readwrite')
		const versionsIndex = tx.store.index('entityId')
		let deletionCursor = await versionsIndex.openKeyCursor(entityId)
		while (deletionCursor) {
			if (deletionCursor.key !== latestVersion.data.id) {
				deletionCursor.delete()
			}
			deletionCursor = await deletionCursor.continue()
		}

		await tx.done

		return {success: true, data: null}
	}

	/**
	 * Delete the given version, will fail if the given version is the latest.
	 *
	 * @param entityKey
	 * @param versionId
	 */
	async deleteVersion<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, versionId: string): Promise<ActionResult> {
		const db = await this.getDb()

		await db.delete(this._getVersionTableName(entityKey), versionId)

		// todo: return error if the give version is not found?
		return {success: true, data: null}
	}

	/**
	 * Fetch a single version
	 *
	 * @param entityKey
	 * @param versionId
	 */
	async getVersion<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, versionId: string): Promise<ActionResult<EntityVersion>> {
		const db = await this.getDb()

		const version = await db.get(this._getVersionTableName(entityKey), versionId)
		if (!version) return {success: false, errors: [{type: ErrorTypes.VERSION_NOT_FOUND, context: versionId}]}

		return {success: true, data: version}
	}

	/**
	 * Return the latest version in the given list of versions.
	 *
	 * @param versions
	 */
	async getLatestVersion(versions: EntityVersion[]): Promise<ActionResult<EntityVersion>> {
		if (versions.length === 0) {
			return {
				success: false,
				errors: [{type: ErrorTypes.ENTITY_WITHOUT_VERSION}]
			}
		}

		const sortedVersions = versions.sort((a, b) => {
			return a.createdAt < b.createdAt ? 1 : 0
		})
		return {success: true, data: sortedVersions[0]}
	}
	
	observableGet<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, id: string) {
		return new Observable<Query<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.get(entityKey, id)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				// Discard if entityKey or ID doesn't match, as the data won't have changed.
				if (e.detail.data.entityKey === entityKey && e.detail.data.id === id) {
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
	
	observableGetMany<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey, ids: string[]) {
		return new Observable<Query<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.getMany(entityKey, ids)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.entityKey === entityKey && ids.includes(e.detail.data.id)) {
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
	
	observableGetAll<EntityKey extends EntityKeys<DataSchema>>(entityKey: EntityKey) {
		return new Observable<Query<EntityDto<z.infer<CurrentSchema<DataSchema, EntityKey>>>[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.getAll(entityKey)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.entityKey === entityKey) {
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
