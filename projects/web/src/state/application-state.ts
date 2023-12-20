import { VaultDatabase } from "./database/application-state";
import { UserDto, VaultDto } from "@localful/common";

/**
 * Database
 * ========================
 */
export interface ApplicationState {
  status: {
    networkStatus: boolean
    errors: {
      global: boolean
    }
  },
  data: {
    current: {
      vault: {
        id: string,
        db: VaultDatabase
      },
      user: UserDto | null
    },
    vaults: VaultDto[]
  },
  ui: {

  }
}
