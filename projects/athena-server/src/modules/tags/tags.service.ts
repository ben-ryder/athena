import {AccessForbiddenError, Injectable} from "@kangojs/core";
import {TagsDatabaseService} from "./database/tags.database.service";
import {
  CreateTagRequest,
  DefaultVaultsListOptions, GetTagResponse,
  GetTagsResponse, ListOptions,
  TagDto,
  TagsQueryParams,
  UpdateTagRequest
} from "@ben-ryder/athena-js-lib";
import {VaultsService} from "../vaults/vaults.service";


@Injectable({
  identifier: "tags-service"
})
export class TagsService {
  constructor(
    private tagsDatabaseService: TagsDatabaseService,
    private vaultsService: VaultsService
  ) {}

  async checkAccess(requestUserId: string, tagId: string): Promise<void> {
    const tag = await this.tagsDatabaseService.getWithOwner(tagId);

    if (tag.owner === requestUserId) {
      return;
    }

    throw new AccessForbiddenError({
      message: "Access forbidden to tag"
    })
  }

  async get(tagId: string): Promise<GetTagResponse> {
    return await this.tagsDatabaseService.get(tagId);
  }

  async getWithAccessCheck(requestUserId: string, tagId: string): Promise<GetTagResponse> {
    await this.checkAccess(requestUserId, tagId);
    return this.get(tagId);
  }

  async add(userId: string, vaultId: string, createTagDto: CreateTagRequest): Promise<TagDto> {
    await this.vaultsService.checkAccess(userId, vaultId);
    return await this.tagsDatabaseService.create(vaultId, createTagDto);
  }

  async update(tagId: string, tagUpdate: UpdateTagRequest): Promise<TagDto> {
    return await this.tagsDatabaseService.update(tagId, tagUpdate)
  }

  async updateWithAccessCheck(requestUserId: string, tagId: string, tagUpdate: UpdateTagRequest): Promise<TagDto> {
    await this.checkAccess(requestUserId, tagId);
    return this.update(tagId, tagUpdate);
  }

  async delete(tagId: string): Promise<void> {
    return this.tagsDatabaseService.delete(tagId);
  }

  async deleteWithAccessCheck(requestUserId: string, tagId: string): Promise<void> {
    await this.checkAccess(requestUserId, tagId);
    return this.delete(tagId);
  }

  async listWithAccessCheck(ownerId: string, tagId: string, options: TagsQueryParams): Promise<GetTagsResponse> {
    const processedOptions: ListOptions = {
      skip: options.skip || DefaultVaultsListOptions.skip,
      take: options.take || DefaultVaultsListOptions.take,
      orderBy: options.orderBy || DefaultVaultsListOptions.orderBy,
      orderDirection: options.orderDirection || DefaultVaultsListOptions.orderDirection
    };

    const tags = await this.tagsDatabaseService.list(ownerId, processedOptions);
    const meta = await this.tagsDatabaseService.getListMetadata(ownerId, processedOptions);

    return {
      tags,
      meta
    }
  }
}
