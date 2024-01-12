import {ZodTypeAny} from "zod";
import {VaultDatabase} from "./database";

export interface VersionedEntityQueriesConfig {
  entityTable: string,
  versionTable: string,
  entityRelationshipId: string
  dataSchema: ZodTypeAny,
}

export class VersionedEntityQueries<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
  db: VaultDatabase
  config: VersionedEntityQueriesConfig

  constructor(db: VaultDatabase, config: VersionedEntityQueriesConfig) {
    this.db = db
    this.config = config
  }

  /**
   * Fetch the given entity, including all decrypted data.
   */
  get(entityId: string) {

  }

  /**
   * Fetch all entities, including all decrypted data.
   */
  getAll() {

  }

  /**
   * Fetch the raw entity.
   */
  getEntity(entityId: string) {

  }

  /**
   * Fetch all raw entity versions.
   */
  getAllVersions() {

  }

  /**
   * Given a list of all versions, return the latest.
   */
  getLatestVersion() {

  }
}
