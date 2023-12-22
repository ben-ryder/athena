import {DeviceStorage, LocalfulDeviceStorage} from "./storage/storage";
import {LFBClient} from "./clients/server-client";
import {UserDto, VaultDto} from "@localful/common";
import { GeneralStorage } from "./storage/general-storage";
import { SecretsStorage } from "./storage/secrets-storage";
import { ApplicationDatabase } from "./storage/application-database";
import { LocalNetwork } from "./network/local-network";
import { DeviceNetwork } from "./network/network";
import { ItemEntity } from "../state/data/current-vault/items/items";


export interface LocalfulDeviceConfig {
  network: LFBClient,
  storage: LocalfulDeviceStorage,
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
}

export const localful = new Localful()