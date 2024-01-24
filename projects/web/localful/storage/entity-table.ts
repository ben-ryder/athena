import { ZodTypeAny } from "zod";
import { ActionResult, ErrorObject, ErrorTypes, Query, QUERY_LOADING, QueryStatus } from "../control-flow";
import { Entity, EntityDto, EntityUpdate, EntityVersion } from "../../src/state/schemas/common/entity";
import { LocalfulEncryption } from "../encryption/localful-encryption";
import { memoryCache } from "./memory-cache";
import { Observable } from "rxjs";
import { LocalfulWeb } from "../localful-web";
import { DataChangeEvent, EventTypes } from "../events/events";

export interface EntityTableConfig {
	entityTable: string,
	versionTable: string,
	dataSchema: ZodTypeAny,
	currentSchemaVersion: string
	useMemoryCache?: boolean
}

export interface EntityTableQueries<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
	get: (id: string) => Promise<ActionResult<DtoSchema>>
	getMany: (ids: string[]) => Promise<ActionResult<DtoSchema[]>>
	getAll: () => Promise<ActionResult<DtoSchema[]>>
	
	create: (data: DataSchema) => Promise<ActionResult<string>>
	update: (id: string, dataUpdate: EntityUpdate<DataSchema>) => Promise<ActionResult<string>>
	delete: (id: string) => Promise<ActionResult>
	purge: (id: string) => Promise<ActionResult>
	
	getEntity: (id: string) => Promise<ActionResult<EntitySchema>>
	getAllVersions: (entityId: string) => Promise<ActionResult<VersionSchema[]>>
	getVersion: (versionId: string) => Promise<ActionResult<VersionSchema>>
	getLatestVersion: (versions: VersionSchema[]) => Promise<ActionResult<VersionSchema>>
	deleteVersion: (versionId: string) => Promise<ActionResult>
	deleteOldVersions: (entityId: string) => Promise<ActionResult>

	_createEntityVersionDto: (entity: EntitySchema, version: VersionSchema) => Promise<DtoSchema>
	
	observableGet: (id: string) => Observable<Query<DtoSchema>>
	observableGetMany: (ids: string[]) => Observable<Query<DtoSchema[]>>
	observableGetAll: () => Observable<Query<DtoSchema[]>>
}

export class EntityTable<EntitySchema extends Entity, VersionSchema extends EntityVersion, DataSchema, DtoSchema extends EntityDto>
	implements EntityTableQueries<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
	localful: LocalfulWeb

	entityTable: string
	versionTable: string
	dataSchema: ZodTypeAny
	useMemoryCache: boolean

	constructor(
		localful: LocalfulWeb,
		config: EntityTableConfig
	) {
		this.localful = localful
		
		this.entityTable = config.entityTable
		this.versionTable = config.versionTable
		this.useMemoryCache = config.useMemoryCache || false
		this.dataSchema = config.dataSchema
	}

	/**
	 * Create a DTO object from the given entity and version.
	 *
	 * @param entity
	 * @param version
	 */
	async _createEntityVersionDto(entity: EntitySchema, version: VersionSchema): Promise<DtoSchema> {
		const encryptionKey = await this.localful.getEncryptionKey()
		const decryptedData = await LocalfulEncryption.decryptAndValidateData<DataSchema>(
			encryptionKey,
			this.dataSchema,
			version.data
		)
		if (!decryptedData.success) return decryptedData as unknown as DtoSchema

		// @ts-expect-error - Trusting that schemas have been implemented correctly.
		return {
			id: entity.id,
			createdAt: entity.createdAt,
			versionId: version.id,
			updatedAt: version.createdAt,
			...decryptedData.data
		}
	}

	/**
	 * Get a single entity, loading the current version.
	 *
	 * @param id
	 */
	async get(id: string): Promise<ActionResult<DtoSchema>> {
		if (this.useMemoryCache) {
			const cachedResponse = await memoryCache.get(`${this.entityTable}-get-${id}`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse as unknown as DtoSchema}
			}
		}

		const entity = await this.getEntity(id)
		if (!entity.success) return entity

		const versions = await this.getAllVersions(id)
		if (!versions.success) return versions

		const latestVersion = await this.getLatestVersion(versions.data)
		if (!latestVersion.success) return latestVersion

		const dto = await this._createEntityVersionDto(entity.data, latestVersion.data)
		if (this.useMemoryCache) {
			await memoryCache.add(`${this.entityTable}-get-${id}`, dto)
		}

		return {success: true, data: dto}
	}

	/**
	 * Get multiple entities, loading the current version for each.
	 *
	 * @param ids
	 */
	async getMany(ids: string[]): Promise<ActionResult<DtoSchema[]>>  {
		const dtos: DtoSchema[] = []
		const errors: ErrorObject[] = []

		for (const id of ids) {
			const dto = await this.get(id)
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
	async getAll(): Promise<ActionResult<DtoSchema[]>> {
		const db = await this.localful._getCurrentDatabase()

		if (this.useMemoryCache) {
			const cachedResponse = await memoryCache.get(`${this.entityTable}-getAll`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse as unknown as DtoSchema[]}
			}
		}

		const entities = await db.table<EntitySchema>(this.entityTable)
			.where('isDeleted').equals(0)
			.toArray()

		const dtos: DtoSchema[] = []
		const errors: ErrorObject[] = []

		for (const entity of entities) {
			const versions = await this.getAllVersions(entity.id)
			if (!versions.success) {
				errors.push(...versions.errors)
				continue
			}
			const latestVersion = await this.getLatestVersion(versions.data)
			if (!latestVersion.success) {
				errors.push(...latestVersion.errors)
				continue
			}

			const dto = await this._createEntityVersionDto(entity, latestVersion.data)
			dtos.push(dto)
		}

		if (this.useMemoryCache) {
			await memoryCache.add(`${this.entityTable}-getAll`, dtos)
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
	 * @param data
	 */
	async create(data: DataSchema): Promise<ActionResult<string>> {
		const db = await this.localful._getCurrentDatabase()

		const entityId = await LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		const encryptionKey = await this.localful.getEncryptionKey()
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, data)
		if (!encResult.success) return encResult

		await db.table(this.entityTable).add({
			id: entityId,
			isDeleted: 0,
			createdAt: timestamp,
		})

		const versionId = await LocalfulEncryption.generateUUID();
		await db.table(this.versionTable).add({
			entityId: entityId,
			id: versionId,
			data: encResult.data,
			createdAt: timestamp
		})

		this.localful.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: this.entityTable, action: 'create', id: entityId})

		return { success: true, data: entityId }
	}

	/**
	 * Update the given entity.
	 * This will load the latest version, apply the given updates, and create a
	 * new version with the updates.
	 *
	 * @param id
	 * @param dataUpdate
	 */
	async update(id: string, dataUpdate: EntityUpdate<DataSchema>): Promise<ActionResult<string>> {
		const db = await this.localful._getCurrentDatabase()

		const oldEntity = await this.get(id)
		if (!oldEntity.success) return oldEntity

		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTable}-get-${id}`)
			await memoryCache.delete(`${this.entityTable}-getAll`)
		}

		const newVersionId = await LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		// Pick out all entity/version fields, which will leave only data fields.
		const {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			id: entityId, versionId, isDeleted,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			createdAt, updatedAt, ...oldData
		} = oldEntity.data
		// @ts-expect-error - Trusting that schema relationships are correct.
		const updatedData: DataSchema = {
			...oldData,
			...dataUpdate
		}

		const encryptionKey = await this.localful.getEncryptionKey()
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, updatedData)
		if (!encResult.success) return encResult

		await db.table(this.versionTable).add({
			entityId: id,
			id: newVersionId,
			data: encResult.data,
			createdAt: timestamp
		})

		this.localful.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: this.entityTable, action: 'update', id: entityId})

		return {success: true, data: newVersionId}
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete(entityId: string): Promise<ActionResult> {
		const db = await this.localful._getCurrentDatabase()

		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTable}-get-${entityId}`)
			await memoryCache.delete(`${this.entityTable}-getAll`)
		}

		await db.table(this.entityTable).update(entityId, {isDeleted: 1})
		await db.table(this.versionTable)
			.where('entityId').equals(entityId)
			.delete()

		this.localful.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: this.entityTable, action: 'delete', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Get all versions
	 *
	 * @param entityId
	 */
	async getAllVersions(entityId: string): Promise<ActionResult<VersionSchema[]>> {
		const db = await this.localful._getCurrentDatabase()

		const versions = await db.table<VersionSchema>(this.versionTable)
			.where('entityId').equals(entityId)
			.toArray()
		return {success: true, data: versions}
	}

	/**
	 * Fetch the entity from the entity table.
	 *
	 * @param entityId
	 */
	async getEntity(entityId: string): Promise<ActionResult<EntitySchema>> {
		const db = await this.localful._getCurrentDatabase()

		const entity = await db.table<EntitySchema>(this.entityTable).get(entityId)

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
	 * @param entityId
	 */
	async purge(entityId: string): Promise<ActionResult> {
		const db = await this.localful._getCurrentDatabase()

		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTable}-get-${entityId}`)
			await memoryCache.delete(`${this.entityTable}-getAll`)
		}

		await db.table(this.entityTable).delete(entityId)
		await db.table(this.versionTable)
			.where('entityId').equals(entityId)
			.delete()

		this.localful.eventManager.dispatch( EventTypes.DATA_CHANGE, { entityKey: this.entityTable, action: 'purge', id: entityId})

		return {success: true, data: null}
	}

	/**
	 * Delete all versions except the most recent.
	 */
	async deleteOldVersions(entityId: string): Promise<ActionResult> {
		const db = await this.localful._getCurrentDatabase()

		const versions = await this.getAllVersions(entityId)
		if (!versions.success) return versions

		const latestVersion = await this.getLatestVersion(versions.data)
		if (!latestVersion.success) return latestVersion

		await db.table(this.versionTable)
			.where('entityId').equals(entityId)
			.and((version => version.id !== latestVersion.data.id))
			.delete()

		return {success: true, data: null}
	}

	/**
	 * Delete the given version, will fail if the given version is the latest.
	 *
	 * @param versionId
	 */
	async deleteVersion(versionId: string): Promise<ActionResult> {
		const db = await this.localful._getCurrentDatabase()

		const numberDeleted = await db.table(this.versionTable)
			.where('id').equals(versionId)
			.delete()

		if (numberDeleted === 0) return {success: true, data: null}
		return {success: false, errors: [{type: ErrorTypes.VERSION_NOT_FOUND, context: versionId}]}
	}

	/**
	 * Fetch a single version
	 *
	 * @param versionId
	 */
	async getVersion(versionId: string): Promise<ActionResult<VersionSchema>> {
		const db = await this.localful._getCurrentDatabase()

		const version = await db.table<VersionSchema>(this.versionTable).get(versionId)
		if (!version) return {success: false, errors: [{type: ErrorTypes.VERSION_NOT_FOUND, context: versionId}]}

		return {success: true, data: version}
	}

	/**
	 * Return the latest version in the given list of versions.
	 *
	 * @param versions
	 */
	async getLatestVersion(versions: VersionSchema[]): Promise<ActionResult<VersionSchema>> {
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
	
	observableGet(id: string) {
		return new Observable<Query<DtoSchema>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.get(id)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				// Discard if entityKey or  ID doesn't match, as the data won't have changed.
				if (e.detail.data.entityKey === this.entityTable && e.detail.data.id === id) {
					runQuery()
				}
			}

			this.localful.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.localful.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.localful.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.localful.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
	
	observableGetMany(ids: string[]) {
		return new Observable<Query<DtoSchema[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.getMany(ids)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.entityKey === this.entityTable && ids.includes(e.detail.data.id)) {
					runQuery()
				}
			}

			this.localful.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.localful.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.localful.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.localful.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
	
	observableGetAll() {
		return new Observable<Query<DtoSchema[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.getAll()
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: CustomEvent<DataChangeEvent['detail']>) => {
				if (e.detail.data.entityKey === this.entityTable) {
					runQuery()
				}
			}

			this.localful.eventManager.subscribe(EventTypes.DATA_CHANGE, handleEvent)
			this.localful.eventManager.subscribe(EventTypes.DATABASE_SWITCH, runQuery)

			// Run initial query
			runQuery()

			return () => {
				this.localful.eventManager.unsubscribe(EventTypes.DATA_CHANGE, handleEvent)
				this.localful.eventManager.unsubscribe(EventTypes.DATABASE_SWITCH, runQuery)
			}
		})
	}
}
