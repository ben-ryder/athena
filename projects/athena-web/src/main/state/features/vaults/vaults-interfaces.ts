import {BaseEntity} from "../../common/base-entity";

export interface Vault extends BaseEntity {
  name: string,
  description: string | null,
  userId: string
}

export interface VaultsState {
  entities: {
    [key: string]: Vault
  },
  ids: string[]
}