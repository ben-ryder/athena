import { ZodTypeAny } from "zod";
import { VaultDatabase } from "./database";
import { Entity, EntityDto, EntityUpdate, EntityVersion } from "../database/common/entity";
import { CryptographyHelper } from "../encryption/cryptography-helper";
import { ActionResult, ErrorObject, ErrorTypes } from "../control-flow";
import {memoryCache} from "./memory-cache";

export interface VersionedEntityQueriesConfig {
  entityTable: string,
  versionTable: string,
  entityRelationshipId: string,
  dataSchema: ZodTypeAny,
  useMemoryCache?: boolean
}

export interface VersionedEntityQueriesMethod<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
  get: (id: string) => Promise<ActionResult<DtoSchema>>
  getMultiple: (ids: string[]) => Promise<ActionResult<DtoSchema[]>>
  create: (data: DataSchema) => Promise<ActionResult<string>>
  update: (id: string, dataUpdate: EntityUpdate<DataSchema>) => Promise<ActionResult<string>>
  delete: (id: string) => Promise<ActionResult>
  getAll: () => Promise<ActionResult<DtoSchema[]>>

  purge: (id: string) => Promise<ActionResult>
  getEntity: (id: string) => Promise<ActionResult<EntitySchema>>

  getAllVersions: (entityId: string) => Promise<ActionResult<VersionSchema[]>>
  getVersion: (versionId: string) => Promise<ActionResult<VersionSchema>>
  getLatestVersion: (versions: VersionSchema[]) => Promise<ActionResult<VersionSchema>>
  deleteVersion: (versionId: string) => Promise<ActionResult>
  deleteOldVersions: (entityId: string) => Promise<ActionResult>

  _createEntityVersionDto: (entity: EntitySchema, version: VersionSchema) => Promise<DtoSchema>
}

export class VersionedEntityQueries<EntitySchema extends Entity, VersionSchema extends EntityVersion, DataSchema, DtoSchema extends EntityDto>
  implements VersionedEntityQueriesMethod<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
  db: VaultDatabase
  config: VersionedEntityQueriesConfig

  constructor(
    db: VaultDatabase,
    config: VersionedEntityQueriesConfig
  ) {
    this.db = db
    this.config = config
  }

  /**
   * Create a DTO object from the given entity and version.
   *
   * @param entity
   * @param version
   */
  async _createEntityVersionDto(entity: EntitySchema, version: VersionSchema): Promise<DtoSchema> {
    const encryptionKey = await this.db.getEncryptionKey()
    const decryptedData = await CryptographyHelper.decryptAndValidateData<DataSchema>(
      encryptionKey,
      this.config.dataSchema,
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
    if (this.config.useMemoryCache) {
      const cachedResponse = await memoryCache.get(`${this.config.entityTable}-get-${id}`)
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
    if (this.config.useMemoryCache) {
      await memoryCache.add(`${this.config.entityTable}-get-${id}`, dto)
    }

    return {success: true, data: dto}
  }

  /**
   * Get multiple entities, loading the current version for each.
   *
   * @param ids
   */
  async getMultiple(ids: string[]): Promise<ActionResult<DtoSchema[]>>  {
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
    if (this.config.useMemoryCache) {
      const cachedResponse = await memoryCache.get(`${this.config.entityTable}-getAll`)
      if (cachedResponse) {
        return {success: true, data: cachedResponse as unknown as DtoSchema[]}
      }
    }

    const entities = await this.db.table<EntitySchema>(this.config.entityTable)
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

    if (this.config.useMemoryCache) {
      await memoryCache.add(`${this.config.entityTable}-getAll`, dtos)
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
    const entityId = await CryptographyHelper.generateUUID();
    const timestamp = new Date().toISOString();

    const encryptionKey = await this.db.getEncryptionKey()
    const encResult = await CryptographyHelper.encryptData(encryptionKey, data)
    if (!encResult.success) return encResult

    await this.db.table(this.config.entityTable).add({
      id: entityId,
      isDeleted: 0,
      createdAt: timestamp,
    })

    const versionId = await CryptographyHelper.generateUUID();
    await this.db.table(this.config.versionTable).add({
      [this.config.entityRelationshipId]: entityId,
      id: versionId,
      data: encResult.data,
      createdAt: timestamp
    })

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

    if (this.config.useMemoryCache) {
      await memoryCache.delete(`${this.config.entityTable}-get-${id}`)
      await memoryCache.delete(`${this.config.entityTable}-getAll`)
    }

    const newVersionId = await CryptographyHelper.generateUUID();
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

    const encryptionKey = await this.db.getEncryptionKey()
    const encResult = await CryptographyHelper.encryptData(encryptionKey, updatedData)
    if (!encResult.success) return encResult

    await this.db.table(this.config.versionTable).add({
      [this.config.entityRelationshipId]: id,
      id: newVersionId,
      data: encResult.data,
      createdAt: timestamp
    })

    return {success: true, data: newVersionId}
  }

  /**
   * Delete the given entity, setting the 'isDeleted' flag ont eh entity and
   * deleting all versions.
   */
  async delete(id: string): Promise<ActionResult> {
    if (this.config.useMemoryCache) {
      await memoryCache.delete(`${this.config.entityTable}-get-${id}`)
      await memoryCache.delete(`${this.config.entityTable}-getAll`)
    }

    await this.db.table(this.config.entityTable).update(id, {isDeleted: 1})
    await this.db.table(this.config.versionTable)
      .where(this.config.entityRelationshipId).equals(id)
      .delete()

    return {success: true, data: null}
  }

  /**
   * Get all versions
   *
   * @param entityId
   */
  async getAllVersions(entityId: string): Promise<ActionResult<VersionSchema[]>> {
    const versions = await this.db.table<VersionSchema>(this.config.versionTable)
      .where(this.config.entityRelationshipId).equals(entityId)
      .toArray()
    return {success: true, data: versions}
  }

  /**
   * Fetch the entity from the entity table.
   *
   * @param entityId
   */
  async getEntity(entityId: string): Promise<ActionResult<EntitySchema>> {
    const entity = await this.db.table<EntitySchema>(this.config.entityTable).get(entityId)

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
  async purge(id: string): Promise<ActionResult> {
    if (this.config.useMemoryCache) {
      await memoryCache.delete(`${this.config.entityTable}-get-${id}`)
      await memoryCache.delete(`${this.config.entityTable}-getAll`)
    }

    await this.db.table(this.config.entityTable).delete(id)
    await this.db.table(this.config.versionTable)
      .where(this.config.entityRelationshipId).equals(id)
      .delete()

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

    await this.db.table(this.config.versionTable)
      .where(this.config.entityRelationshipId).equals(entityId)
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
    const numberDeleted = await this.db.table(this.config.versionTable)
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
    const version = await this.db.table<VersionSchema>(this.config.versionTable).get(versionId)
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
}
