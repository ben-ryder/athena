import {DeviceStorage} from "./storage/storage";
import { LoginRequest, UpdateVaultDto, UserDto, VaultDto, VaultEntity } from "@localful/common";
import { DeviceNetwork } from "./network/network";
import {z} from "zod";
import { VaultStatusDto } from "./storage/application-database";
import { EncryptionHelper } from "./encryption/encryption-helper";

export interface VaultResult {
  vault: VaultEntity
  status: VaultStatusDto
}

export interface SaveContentRequest<Schema> {
  vaultId: string,
  type: string,
  schema: z.ZodType<Schema>,
  data: Schema
}

export interface GetContentRequest<Schema> {
  vaultId: string,
  id: string,
  schema: z.ZodType<Schema>,
}

export interface UpdateContentRequest<Schema> {
  vaultId: string,
  id: string,
  schema: z.ZodType<Schema>,
  data: Schema
}


export class Localful {
  storage: DeviceStorage
  network: DeviceNetwork

  constructor() {
    this.storage = new DeviceStorage()
    this.network = new DeviceNetwork({
      server: {
        getAccessToken: this.storage.secrets.loadAccessToken,
        getRefreshToken: this.storage.secrets.loadRefreshToken,
        onEvent: this.handleServerEvent
      }
    })
  }

  async handleServerEvent(event: any) {
    console.log(`[Server Event]: ${event}`)
  }

  async _constructVaultResult(vault: VaultEntity) {
    let status = await this.storage.app.vaultsStatus.get(vault.id)
    if (!status) {
      status = {
        id: vault.id,
        location: "local",
        unlock: "locked"
      }

      // todo: should defaults be set, an error be thrown, or vault ignored?
      await this.storage.app.vaultsStatus.add(status)
    }

    return { vault, status }
  }

  async getVaults(): Promise<VaultResult[]> {
    const vaults = await this.storage.app.vaults.orderBy('updatedAt').toArray();

    const results: VaultResult[] = []
    for (const vault of vaults) {
      const result = await this._constructVaultResult(vault)
      results.push(result)
    }
    return results
  }

  async getVault(id: string): Promise<VaultResult|null> {
    const vault = await this.storage.app.vaults.get(id);
    if (vault) {
      return this._constructVaultResult(vault)
    }
    return null
  }

  async updateVault(id: string, updateVaultDto: UpdateVaultDto): Promise<VaultResult> {
    const vault = await this.storage.app.vaults.get(id);
    if (!vault) {
      throw Error("No vault found")
    }

    const valid = UpdateVaultDto.safeParse(updateVaultDto)
    if (!valid.success) {
      throw Error("Update data invalid")
    }

    await this.storage.app.vaults.update(id, updateVaultDto)

    // todo: trigger vault sync if server vault (regardless of being synced or not)

    return this.getVault(id)
  }

  async deleteVault(id: string) {
    await this.storage.app.vaults.delete(id)
    await this.storage.app.vaultsStatus.delete(id)

    // Delete all content and versions
    const vaultContent = await this.storage.app.content.where('vaultId').equals(id).toArray()
    for (const content of vaultContent) {
      await this.storage.app.versions.where('contentId').equals(content.id).delete()
      await this.storage.app.content.delete(content.id)
    }
  }

  async unlockVault(id: string, password: string){
    const vault = await this.getVault(id)
    if (!vault) {
      throw Error("vault not found")
    }

    //const encryptionKey = await EncryptionHelper.decryptProtectedKey(vault.vault.protectedEncryptionKey, password)
    //await this.storage.secrets.saveVaultEncryptionKey(id, encryptionKey)
  }

  async lockVault(id: string) {
    await this.storage.secrets.deleteVaultEncryptionKey(id)
  }

  async createServerVault(): Promise<VaultDto> {

  }

  async connectServerVault(vaultId: string): Promise<void> {
    // check if server vault exists, create if not
    // Setup socket connection or add vault to subscriptions
    // Trigger vault sync
    // Trigger content sync
  }

  async disconnectServerVault(vaultId: string): Promise<void> {
    // unsubscribe from server updates
  }

  async deleteServerVault(vaultId: string): Promise<void> {

  }

  async getCurrentUser(): Promise<UserDto|null> {

  }

  async login(credentials: LoginRequest): Promise<UserDto> {
    // login to server
    // save user to storage
    // save tokens to storage

    // trigger vault sync
  }

  async logout(): Promise<void> {
    // logout user with server
    // delete user & tokens
    // KEEP VAULTS LOCALLY
  }

  async syncUser(): Promise<void> {
    // fetch current user from server
    // overwrite local user or push update to server if `updatedAt` timestamp different
  }

  async syncVaults(): Promise<void> {
    // fetch vaults from server
    // if local exists, sync based on createdAt timestamp
    // if no local, save anyway
  }

  async syncContent(): Promise<void> {
    // for each synced vault
    // sync each piece of content
    // upload versions only on local
    // download versions only on server
    // delete local versions that are deleted on server
  }

  async init(): Promise<void> {
    // if connected to server, trigger all syncs
  }

  async connectServer(): Promise<void> {

  }
  async disconnectServer(): Promise<void> {
    
  }

  async createContent(): Promise<void> {

  }

  async updateContentVersion(): Promise<void> {

  }

  async getContent<T>(data: GetContentRequest<T>): Promise<T> {

  }

  async getContentByType(): Promise<void> {

  }

  async getContentVersions(): Promise<void> {

  }

  async deleteContent(id: string) {

  }
}

export const localful = new Localful()