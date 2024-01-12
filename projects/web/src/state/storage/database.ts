import { Dexie, Table } from "dexie";
import {TagData, TagDto, TagEntity, TagVersion} from "../database/tags/tags";
import {AttachmentEntity} from "../database/attachments/attachments";
import {ContentTypeEntity, ContentTypeVersion} from "../database/content-types/content-types";
import {FieldEntity, FieldVersion} from "../database/fields/fields";
import {ContentEntity, ContentVersion} from "../database/content/content";
import {VersionedEntityQueries} from "./entity-queries";

export const EXAMPLE_VAULT_ID = "d7ef8db9-e401-4971-93e2-156d94a0a8d2"

export class VaultDatabase extends Dexie {
  tags!: Table<TagEntity>;
  tags_versions!: Table<TagVersion>;
  content_types!: Table<ContentTypeEntity>
  content_types_versions!: Table<ContentTypeVersion>
  fields!: Table<FieldEntity>
  fields_versions!: Table<FieldVersion>
  content!: Table<ContentEntity>
  content_versions!: Table<ContentVersion>
  attachments!: Table<AttachmentEntity>

  tagQueries!: VersionedEntityQueries<TagEntity, TagVersion, TagData, TagDto>

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

    this.tagQueries = new VersionedEntityQueries<TagEntity, TagVersion, TagData, TagDto>(this, {
      entityTable: "tags",
      versionTable: "tags_versions",
      entityRelationshipId: "tagId",
      dataSchema: TagData
    })
  }
}

export const db = new VaultDatabase(`vault_${EXAMPLE_VAULT_ID}`)
