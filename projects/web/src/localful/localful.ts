import {DeviceStorage} from "./storage/storage";
import {LoginRequest, UpdateVaultDto, UserDto, VaultDto} from "@localful/common";
import { DeviceNetwork } from "./network/network";
import {z} from "zod";
import {Entity} from "../state/data/current-vault/common/entity";

export const VaultDtoWithMetadata = VaultDto.extend({
  type: z.enum(['local', 'server', 'synced'])
})
export type VaultDtoWithMetadata = z.infer<typeof VaultDtoWithMetadata>

export interface SaveContentRequest<Schema> {
  type: string,
  schema: z.ZodType<Schema>,
  data: Schema
}

export interface GetContentRequest<Schema> {
  id: string,
  schema: z.ZodType<Schema>,
}

export interface UpdateContentRequest<Schema> {
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

  // todo: return modified VaultDto with `type: local | local-server | server` property
  async getVaults(): Promise<VaultDtoWithMetadata[]> {
    // get all vaults
  }

  async getVault(id: string): Promise<VaultDtoWithMetadata|null> {
    // get a vault (any stored vault, could be server only)
  }

  async updateVault(id: string, content: UpdateVaultDto): Promise<VaultDto> {
    // update a local vault
    // trigger vault sync if server vault (regardless of being synced or not)
  }

  async deleteVault(id: string) {
    // delete local vault
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