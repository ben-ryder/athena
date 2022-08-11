import {AccessForbiddenError, Injectable} from "@kangojs/core";
import {VaultsDatabaseService} from "./database/vaults.database.service";
import {
  CreateVaultRequest,
  GetVaultResponse,
  GetVaultsResponse, UpdateVaultRequest,
  VaultDto, VaultsQueryParams
} from "@ben-ryder/athena-js-lib";
import {DefaultVaultsListOptions} from "@ben-ryder/athena-js-lib";
import {DatabaseListOptions} from "../../common/internal-list-options";


@Injectable({
  identifier: "vaults-service"
})
export class VaultsService {
  constructor(
    private vaultsDatabaseService: VaultsDatabaseService
  ) {}

  async checkAccess(requestUserId: string, vaultId: string): Promise<void> {
    const vault = await this.vaultsDatabaseService.getWithOwner(vaultId);

    if (vault.owner === requestUserId) {
      return;
    }

    throw new AccessForbiddenError({
      message: "Access forbidden to vault"
    })
  }

  async get(vaultId: string): Promise<GetVaultResponse> {
    return await this.vaultsDatabaseService.get(vaultId);
  }

  async getWithAccessCheck(requestUserId: string, vaultId: string): Promise<GetVaultResponse> {
    await this.checkAccess(requestUserId, vaultId);
    return this.get(vaultId);
  }

  async add(ownerId: string, createVaultDto: CreateVaultRequest): Promise<VaultDto> {
    return await this.vaultsDatabaseService.create(ownerId, createVaultDto);
  }

  async update(vaultId: string, vaultUpdate: UpdateVaultRequest): Promise<VaultDto> {
    return await this.vaultsDatabaseService.update(vaultId, vaultUpdate)
  }

  async updateWithAccessCheck(requestUserId: string, vaultId: string, vaultUpdate: UpdateVaultRequest): Promise<VaultDto> {
    await this.checkAccess(requestUserId, vaultId);
    return this.update(vaultId, vaultUpdate);
  }

  async delete(vaultId: string): Promise<void> {
    return this.vaultsDatabaseService.delete(vaultId);
  }

  async deleteWithAccessCheck(requestUserId: string, vaultId: string): Promise<void> {
    await this.checkAccess(requestUserId, vaultId);
    return this.delete(vaultId);
  }

  async list(ownerId: string, options: VaultsQueryParams): Promise<GetVaultsResponse> {
    const processedOptions: DatabaseListOptions = {
      skip: options.skip || DefaultVaultsListOptions.skip,
      take: options.take || DefaultVaultsListOptions.take,
      orderBy: options.orderBy || DefaultVaultsListOptions.orderBy,
      orderDirection: options.orderDirection || DefaultVaultsListOptions.orderDirection
    };

    const vaults = await this.vaultsDatabaseService.list(ownerId, processedOptions);
    const meta = await this.vaultsDatabaseService.getListMetadata(ownerId, processedOptions);

    return {
      vaults,
      meta
    }
  }
}
