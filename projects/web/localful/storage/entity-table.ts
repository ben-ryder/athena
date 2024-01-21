import { ZodTypeAny } from "zod";
import { ActionResult, ErrorObject, ErrorTypes, Query, QUERY_LOADING, QueryStatus } from "../control-flow";
import { Entity, EntityDto, EntityUpdate, EntityVersion } from "../../src/state/schemas/common/entity";
import { LocalfulEncryption } from "../encryption/localful-encryption";
import { memoryCache } from "./memory-cache";
import { Observable } from "rxjs";
import { LocalfulWeb } from "../localful-web";
import { createDataEvent, DataEventCauses, DataEventDetails, getDataEventKey } from "../events/events";
import { Dexie } from "dexie";


export interface EntityTableConfig {
	entityKey: string,
	dataSchema: ZodTypeAny,
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
	observableGetMany: (id: string) => Observable<Query<DtoSchema[]>>
	observableGetAll: (id: string) => Observable<Query<DtoSchema[]>>
}

export class EntityTable<EntitySchema extends Entity, VersionSchema extends EntityVersion, DataSchema, DtoSchema extends EntityDto>
	implements EntityTableQueries<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
	localful: LocalfulWeb
	db: Dexie

	entityTableName: string
	versionTableName: string
	dataSchema: ZodTypeAny
	useMemoryCache: boolean

	constructor(
		db: Dexie,
		config: EntityTableConfig
	) {
		this.db = db
		
		this.entityTableName = config.entityKey
		this.versionTableName = `${config.entityKey}_versions`
		this.useMemoryCache = config.useMemoryCache
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
			const cachedResponse = await memoryCache.get(`${this.entityTableName}-get-${id}`)
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
			await memoryCache.add(`${this.entityTableName}-get-${id}`, dto)
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
		if (this.useMemoryCache) {
			const cachedResponse = await memoryCache.get(`${this.entityTableName}-getAll`)
			if (cachedResponse) {
				return {success: true, data: cachedResponse as unknown as DtoSchema[]}
			}
		}

		const entities = await this.db.table<EntitySchema>(this.entityTableName)
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
			await memoryCache.add(`${this.entityTableName}-getAll`, dtos)
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
		const entityId = await LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		const encryptionKey = await this.localful.getEncryptionKey()
		const encResult = await LocalfulEncryption.encryptData(encryptionKey, data)
		if (!encResult.success) return encResult

		await this.db.table(this.entityTableName).add({
			id: entityId,
			isDeleted: 0,
			createdAt: timestamp,
		})

		const versionId = await LocalfulEncryption.generateUUID();
		await this.db.table(`${this.entityTableName}_versions`).add({
			entityId: entityId,
			id: versionId,
			data: encResult.data,
			createdAt: timestamp
		})

		const event = createDataEvent(this.entityTableName, {cause: DataEventCauses.CREATE, id: entityId})
		this.localful.events.dispatchEvent(event)

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
		const oldEntity = await this.get(id)
		if (!oldEntity.success) return oldEntity

		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTableName}-get-${id}`)
			await memoryCache.delete(`${this.entityTableName}-getAll`)
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

		await this.db.table(this.versionTableName).add({
			entityId: id,
			id: newVersionId,
			data: encResult.data,
			createdAt: timestamp
		})

		const event = createDataEvent(this.entityTableName, {cause: DataEventCauses.UPDATE, id: entityId})
		this.localful.events.dispatchEvent(event)

		return {success: true, data: newVersionId}
	}

	/**
	 * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
	 * deleting all versions.
	 */
	async delete(entityId: string): Promise<ActionResult> {
		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTableName}-get-${entityId}`)
			await memoryCache.delete(`${this.entityTableName}-getAll`)
		}

		await this.db.table(this.entityTableName).update(entityId, {isDeleted: 1})
		await this.db.table(this.versionTableName)
			.where(this.versionTableName).equals(entityId)
			.delete()

		const event = createDataEvent(this.entityTableName, {cause: DataEventCauses.DELETE, id: entityId})
		this.localful.events.dispatchEvent(event)

		return {success: true, data: null}
	}

	/**
	 * Get all versions
	 *
	 * @param entityId
	 */
	async getAllVersions(entityId: string): Promise<ActionResult<VersionSchema[]>> {
		const versions = await this.db.table<VersionSchema>(this.versionTableName)
			.where(this.versionTableName).equals(entityId)
			.toArray()
		return {success: true, data: versions}
	}

	/**
	 * Fetch the entity from the entity table.
	 *
	 * @param entityId
	 */
	async getEntity(entityId: string): Promise<ActionResult<EntitySchema>> {
		const entity = await this.db.table<EntitySchema>(this.entityTableName).get(entityId)

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
	 * @param id
	 */
	async purge(entityId: string): Promise<ActionResult> {
		if (this.useMemoryCache) {
			await memoryCache.delete(`${this.entityTableName}-get-${entityId}`)
			await memoryCache.delete(`${this.entityTableName}-getAll`)
		}

		await this.db.table(this.entityTableName).delete(entityId)
		await this.db.table(this.versionTableName)
			.where(this.versionTableName).equals(entityId)
			.delete()

		const event = createDataEvent(this.entityTableName, {cause: DataEventCauses.DELETE, id: entityId})
		this.localful.events.dispatchEvent(event)

		return {success: true, data: null}
	}

	/**
	 * Delete all versions except the most recent.
	 */
	async deleteOldVersions(entityId: string): Promise<ActionResult> {
		const versions = await this.getAllVersions(entityId)
		if (!versions.success) return versions

		const latestVersion = await this.getLatestVersion(versions.data)
		if (!latestVersion.success) return latestVersion

		await this.db.table(this.versionTableName)
			.where(this.versionTableName).equals(entityId)
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
		const numberDeleted = await this.db.table(this.versionTableName)
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
		const version = await this.db.table<VersionSchema>(this.versionTableName).get(versionId)
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
			const eventKey = getDataEventKey(this.entityTableName)
			subscriber.next(QUERY_LOADING)

			const query = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.get(id)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
			}

			const handleEvent = (e: CustomEvent<DataEventDetails>) => {
				// Discard query if ID doesn't match, as the data won't have changed.
				if (e.detail.id === id) {
					query()
				}
			}

			this.localful.events.addEventListener(eventKey, handleEvent)

			return () => {
				this.localful.events.removeEventListener(eventKey, handleEvent)
			}
		})
	}
	
	observableGetMany(ids: string[]) {
		
	}
	
	observableGetAll(): {
		
	}
}
