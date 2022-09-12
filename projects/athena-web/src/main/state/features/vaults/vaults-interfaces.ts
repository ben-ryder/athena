import {BaseEntity} from "../../common/base-database-entity";

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