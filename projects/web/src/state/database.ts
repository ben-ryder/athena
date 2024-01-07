import { Dexie, Table } from "dexie";
import { TagData, TagDto, TagEntity, TagVersion } from "./database/tags/tags";
import { EntityUpdate } from "./database/common/entity";
import { ActionResult, ActionStatus, ApplicationErrorType } from "./actions";

export const EXAMPLE_VAULT_ID = "d7ef8db9-e401-4971-93e2-156d94a0a8d2"

export class ApplicationDatabase extends Dexie {
  tags!: Table<TagEntity>;
  tags_versions!: Table<TagVersion>;

  constructor() {
    super('athena');
    this.version(1.1).stores({
      tags: '&id,vaultId',
      tags_versions: '&id,parentId,createdAt',
    });

    this.getTags = this.getTags.bind(this)
  }

  async getTags(): Promise<ActionResult<TagDto[]>> {
    const tags: TagDto[] = []
    const tagEntities = await this.tags.toArray()

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

    return {
      status: ActionStatus.SUCCESS,
      data: tags
    }
  }

  async getTag(entityId: string): Promise<ActionResult<TagDto>> {
    const tagEntity = await this.tags.get(entityId)
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
    return db.tags_versions
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

  async createTag(data: TagData): Promise<string> {
    const entityId = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    await db.tags.add({
      vaultId: EXAMPLE_VAULT_ID,
      id: entityId,
      createdAt: timestamp,
    })

    const versionId = self.crypto.randomUUID();
    await db.tags_versions.add({
      parentId: entityId,
      id: versionId,
      name: data.name,
      variant: data.variant,
      createdAt: timestamp
    })

    return entityId
  }

  async updateTag(entityId: string, updateData: EntityUpdate<TagData>) {
    const oldVersion = await this.getLatestTagVersion(entityId)
    const newVersionId = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    await db.tags_versions.add({
      parentId: entityId,
      id: newVersionId,
      name: updateData.name || oldVersion.name,
      variant: updateData.variant || oldVersion.variant,
      createdAt: timestamp
    })
  }

  async deleteTag(entityId: string) {
    await db.tags.delete(entityId)
    await db.tags_versions
      .where("parentId").equals(entityId)
      .delete()
  }
}

export const db = new ApplicationDatabase()
