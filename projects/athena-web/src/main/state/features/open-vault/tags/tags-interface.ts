import {BaseDatabaseEntity} from "../../../common/base-database-entity";

export interface DatabaseTag extends BaseDatabaseEntity {
  name: string,
  textColour: string,
  backgroundColour: string,
}

export interface Tag extends DatabaseTag {}

export interface TagsState {
  entities: {
    [key: string]: DatabaseTag
  },
  ids: string[]
}