import {BaseDatabaseEntity} from "../../../common/base-database-entity";

export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}

export interface DatabaseTag extends BaseDatabaseEntity, TagContent{}

export interface Tag extends DatabaseTag {}

export interface TagsState {
  entities: {
    [key: string]: DatabaseTag
  },
  ids: string[]
}