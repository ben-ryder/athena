import { TagData, TagDto, TagEntity, TagVersion } from "./tags";
import { VaultDatabase, EXAMPLE_VAULT_ID } from "../../database";
import { ActionResult, ActionStatus, ApplicationErrorType } from "../../actions";
import { EntityUpdate } from "../common/entity";
import { EncryptionHelper, EXAMPLE_KEY } from "../../../utils/encryption/encryption-helper";

export class TagsDatabase {
  db: VaultDatabase

  constructor(db: VaultDatabase) {
    this.db = db
    this.getTags = this.getTags.bind(this)
  }

  async getTags(): Promise<ActionResult<TagDto[]>> {
    const tags: TagDto[] = []
    const tagEntities = await this.db.tags.toArray()

    for (const tagEntity of tagEntities) {
      const latestVersion = await this.getLatestTagVersion(tagEntity.id)

      tags.push({
        vaultId: tagEntity.vaultId,
        id: tagEntity.id,
        versionId: latestVersion.id,
        name: latestVersion.name,
        variant: latestVersion.variant,
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
    const tagEntity = await this.db.tags.get(entityId)
    if (!tagEntity) {
      return {
        status: ActionStatus.ERROR,
        errors: [
          {
            type: ApplicationErrorType.ENTITY_NOT_FOUND,
          }
        ]
      }
    }

    const latestVersion = await this.getLatestTagVersion(entityId)
    return {
      status: ActionStatus.SUCCESS,
      data: {
        vaultId: tagEntity.vaultId,
        id: tagEntity.id,
        versionId: latestVersion.id,
        name: latestVersion.name,
        variant: latestVersion.variant,
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
      .where('parentId')
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
    const entityId = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const encResult = await EncryptionHelper.encrypt(EXAMPLE_KEY, tagData)
    if (!encResult.success) {
      return encResult
    }

    await this.db.tags.add({
      id: entityId,
      createdAt: timestamp,
    })

    const versionId = self.crypto.randomUUID();
    await this.db.tags_versions.add({
      tagId: entityId,
      id: versionId,
      data: encResult.data,
      createdAt: timestamp
    })

    return { success: true, data: entityId }
  }

  async updateTag(entityId: string, updateData: EntityUpdate<TagData>) {
    const oldVersion = await this.getLatestTagVersion(entityId)
    const newVersionId = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const updatedTag: TagData = {
      name: updateData.name || oldVersion.name,
      variant: updateData.variant || oldVersion.variant
    }
    const encResult = await EncryptionHelper.encrypt(EXAMPLE_KEY, tagData)
    if (!encResult.success) {
      return encResult
    }

    await this.db.tags_versions.add({
      parentId: entityId,
      id: newVersionId,
      name: updateData.name || oldVersion.name,
      variant: updateData.variant || oldVersion.variant,
      createdAt: timestamp
    })
  }

  async deleteTag(entityId: string) {
    await this.db.tags.delete(entityId)
    await this.db.tags_versions
      .where("parentId").equals(entityId)
      .delete()
  }
}
