import { Dexie, Table } from "dexie";
import { TagEntity, TagVersion } from "./database/tags/tags";
import { TagsDatabase } from "./database/tags/tags.database";

export const EXAMPLE_VAULT_ID = "d7ef8db9-e401-4971-93e2-156d94a0a8d2"

export class VaultDatabase extends Dexie {
  tags!: Table<TagEntity>;
  tags_versions!: Table<TagVersion>;

  tagsHelper!: TagsDatabase

  constructor(vaultId: string) {
    super(`vault_${vaultId}`);

    this.version(1).stores({
      tags: 'id, isDeleted',
      tags_versions: 'id, tagId, createdAt',

      content_types: 'id, isDeleted',
      content_types_versions: 'id, contentTypeId, createdAt',
      fields:  'id, contentTypeId, isDeleted', // type
      fields_versions: 'id, fieldId, createdAt',

      content: 'id, contentTypeId, isDeleted',
      content_versions: 'id, contentId, createdAt',
      content_fields_versions: 'id, [contentId+fieldId], createdAt'
    });

    this.tagsHelper = new TagsDatabase(this)
  }
}

export const db = new VaultDatabase(EXAMPLE_VAULT_ID)
