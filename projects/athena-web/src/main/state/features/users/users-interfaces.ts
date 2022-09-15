import {BaseDatabaseEntity} from "../../common/base-database-entity";


export interface User extends BaseDatabaseEntity {
  username: string
}

export interface UsersState {
  entities: {
    [key: string]: User
  },
  ids: string[]
}
