import {LocalNetwork} from "./local-network";
import {ServerClient, ServerClientConfig} from "./server-client";

export interface DeviceNetworkConfig {
  server: ServerClientConfig
}

export class DeviceNetwork {
  readonly server: ServerClient
  readonly local: LocalNetwork

  constructor(config: DeviceNetworkConfig) {
    this.local = new LocalNetwork()
    this.server = new ServerClient(config.server)
  }
}
