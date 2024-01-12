import { TagData, TagDto, TagVersion } from "./tags";
import { VaultDatabase } from "../../storage/database";
import { ActionResult, ActionStatus, ApplicationErrorType, QueryResult } from "../../actions";
import { EntityUpdate } from "../common/entity";
import { CryptographyHelper, EXAMPLE_KEY } from "../../../localful/encryption/cryptography-helper";

export class TagsDatabase {
  db: VaultDatabase

  constructor(db: VaultDatabase) {
    this.db = db
    this.getTags = this.getTags.bind(this)
  }

  async getTags(): Promise<QueryResult<TagDto[]>> {
    const tags: TagDto[] = []
    const tagEntities = await this.db.tags.toArray()

    for (const tagEntity of tagEntities) {
      const latestVersion = await this.getLatestTagVersion(tagEntity.id)

      const decryptResult = await CryptographyHelper.decryptAndValidateData<TagData>(
        EXAMPLE_KEY,
        TagData,
        latestVersion.data
      )
      if (!decryptResult.success) {
        return { status: ActionStatus.ERROR, errors: decryptResult.errors }
      }

      tags.push({
        id: tagEntity.id,
        versionId: latestVersion.id,
        name: decryptResult.data.name,
        variant: decryptResult.data.variant,
        createdAt: tagEntity.createdAt,
        updatedAt: latestVersion.createdAt
      })
    }

    const sortedTags = tags.sort((a, b) => {
      return a.name > b.name ? 1 : 0
    })

    return {
      status: ActionStatus.SUCCESS,
      data: sortedTags
    }
  }

  async getTag(entityId: string): Promise<ActionResult<TagDto>> {
    const tagEntity = await this.db.table('tags').get(entityId)
    if (!tagEntity) {
      return {
        success: false,
        errors: [{type: ApplicationErrorType.ENTITY_NOT_FOUND}]
      }
    }

    const latestVersion = await this.getLatestTagVersion(entityId)
    const decryptResult = await CryptographyHelper.decryptAndValidateData(
      EXAMPLE_KEY,
      TagData,
      latestVersion.data
    )
    if (!decryptResult.success) return decryptResult

    return {
      success: true,
      data: {
        id: tagEntity.id,
        versionId: latestVersion.id,
        name: decryptResult.data.name,
        variant: decryptResult.data.variant,
        createdAt: tagEntity.createdAt,
        updatedAt: latestVersion.createdAt
      }
    }
  }
  createGetTagQuery(entityId: string) {
    return async () => {
      return this.getTag(entityId)
    }
  }

  async getTagVersions(entityId: string): Promise<TagVersion[]> {
    return this.db.tags_versions
      .where('tagId')
      .equals(entityId)
      .toArray()
  }

  async getLatestTagVersion(entityId: string) {
    const versions = await this.getTagVersions(entityId)
    const sortedVersions = versions.sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : 0
    })
    return sortedVersions[0]
  }

  async createTag(tagData: TagData): Promise<ActionResult<string>> {
    const entityId = await CryptographyHelper.generateUUID();
    const timestamp = new Date().toISOString();

    const encResult = await CryptographyHelper.encryptData(EXAMPLE_KEY, tagData)
    if (!encResult.success) return encResult

    await this.db.tags.add({
      id: entityId,
      createdAt: timestamp,
    })

    const versionId = await CryptographyHelper.generateUUID();
    await this.db.tags_versions.add({
      tagId: entityId,
      id: versionId,
      data: encResult.data,
      createdAt: timestamp
    })

    return { success: true, data: entityId }
  }

  async updateTag(entityId: string, updateData: EntityUpdate<TagData>) {
    const oldTag = await this.getTag(entityId)
    if (!oldTag.success) return oldTag.errors

    const newVersionId = await CryptographyHelper.generateUUID();
    const timestamp = new Date().toISOString();

    const updatedTag: TagData = {
      name: updateData.name || oldTag.data.name,
      variant: updateData.variant || oldTag.data.variant
    }
    const encResult = await CryptographyHelper.encryptData(EXAMPLE_KEY, updatedTag)
    if (!encResult.success) return encResult

    await this.db.tags_versions.add({
      tagId: entityId,
      id: newVersionId,
      data: encResult.data,
      createdAt: timestamp
    })
  }

  async deleteTag(entityId: string) {
    await this.db.tags.delete(entityId)
    await this.db.tags_versions
      .where("tagId").equals(entityId)
      .delete()
  }
}
