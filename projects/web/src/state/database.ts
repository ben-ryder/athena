import { Dexie, Table } from "dexie";
import { TagEntity, TagVersion } from "./database/tags/tags";
import { TagsDatabase } from "./database/tags/tags.database";
import {AttachmentEntity} from "./database/attachments/attachments";

export const EXAMPLE_VAULT_ID = "d7ef8db9-e401-4971-93e2-156d94a0a8d2"

export class VaultDatabase extends Dexie {
  tags!: Table<TagEntity>;
  tags_versions!: Table<TagVersion>;
  attachments!: Table<AttachmentEntity>

  tagsHelper!: TagsDatabase

  constructor(vaultName: string) {
    super(vaultName);

    this.version(1).stores({
      tags: 'id, isDeleted',
      tags_versions: 'id, tagId, createdAt',
      content_types: 'id, isDeleted',
      content_types_versions: 'id, contentTypeId, createdAt',
      fields:  'id, contentTypeId, isDeleted', // type
      fields_versions: 'id, fieldId, createdAt',
      content: 'id, contentTypeId, isDeleted',
      content_versions: 'id, contentId, createdAt',
      attachments: 'id, isDeleted'
    });

    this.tagsHelper = new TagsDatabase(this)
  }
}

export class VersionedEntityQueries {
  db: VaultDatabase

  constructor(db: VaultDatabase) {
    this.db = db
  }

  /**
   * Fetch the given entity, including all decrypted data.
   */
  get() {

  }

  /**
   * Fetch all entities, including all decrypted data.
   */
  getAll() {

  }

  /**
   * Fetch the raw entity.
   */
  getEntity() {

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

export const db = new VaultDatabase(`vault_${EXAMPLE_VAULT_ID}`)
