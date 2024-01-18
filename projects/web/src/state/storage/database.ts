import { Dexie, Table } from "dexie";
import {TagData, TagDto, TagEntity, TagVersion} from "../schemas/tags/tags";
import {AttachmentEntity} from "../schemas/attachments/attachments";
import {
  ContentTypeData,
  ContentTypeDto,
  ContentTypeEntity,
  ContentTypeVersion
} from "../schemas/content-types/content-types";
import {FieldDefinition, FieldDto, FieldEntity, FieldVersion} from "../schemas/fields/fields";
import {ContentData, ContentDto, ContentEntity, ContentVersion} from "../schemas/content/content";
import {VersionedEntityQueries} from "./entity-queries";
import * as WebCrypto from "easy-web-crypto";

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
  contentTypeQueries!: VersionedEntityQueries<ContentTypeEntity, ContentTypeVersion, ContentTypeData, ContentTypeDto>
  fieldQueries!: VersionedEntityQueries<FieldEntity, FieldVersion, FieldDefinition, FieldDto>
  contentQueries!: VersionedEntityQueries<ContentEntity, ContentVersion, ContentData, ContentDto>

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
      dataSchema: TagData,
      useMemoryCache: false
    })
    this.contentTypeQueries = new VersionedEntityQueries<ContentTypeEntity, ContentTypeVersion, ContentTypeData, ContentTypeDto>(
      this,
      {
        entityTable: "content_types",
        versionTable: "content_types_versions",
        entityRelationshipId: "contentTypeId",
        dataSchema: ContentTypeData,
        useMemoryCache: false
      }
    )
    this.fieldQueries = new VersionedEntityQueries<FieldEntity, FieldVersion, FieldDefinition, FieldDto>(
      this,
      {
        entityTable: "fields",
        versionTable: "fields_versions",
        entityRelationshipId: "fieldId",
        dataSchema: FieldDefinition,
        useMemoryCache: false
      }
    )
    this.contentQueries = new VersionedEntityQueries<ContentEntity, ContentVersion, ContentData, ContentDto>(
      this,
      {
        entityTable: "content",
        versionTable: "content_versions",
        entityRelationshipId: "contentId",
        dataSchema: ContentData,
      }
    )
  }

  async getEncryptionKey(): Promise<CryptoKey> {
    const passphrase = "super secure passphrase"
    const encMasterKey = {"derivationParams":{"salt":"817004d86c216356b62cd3974342201b","iterations":100000,"hashAlgo":"SHA-256"},"encryptedMasterKey":{"ciphertext":"397fe7cade63bf6a893151636a1516307b03dd6b7fb79c5ed46db926bc69a9bf38607d1e598d3910a8eb75a808d20b89b64bc17ddd9f9abac7d7e8b5294bedb3b437f569e639676087907db56a6874a91bab","iv":"94ac25b2fd7a130c7ce27e7c"}}
    return WebCrypto.decryptMasterKey(passphrase, encMasterKey)
  }
}

export const db = new VaultDatabase(`vault_${EXAMPLE_VAULT_ID}`)
