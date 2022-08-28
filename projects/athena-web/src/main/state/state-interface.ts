import {OpenVaultState} from "./features/open-vault/open-vault-interfaces";
import {VaultsState} from "./features/vaults/vaults-interfaces";
import {UsersState} from "./features/users/users-interfaces";
import {UIState} from "./features/ui/ui-interface";

export interface ApplicationState {
  ui: UIState,
  users: UsersState
  vaults: VaultsState
  openVault: OpenVaultState
}