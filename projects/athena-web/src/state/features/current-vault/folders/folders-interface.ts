import {BaseDatabaseEntity} from "../../../common/base-database-entity";

export interface FolderContent {
  name: string,
  parentId: string | null,
}

export interface DatabaseFolder extends BaseDatabaseEntity, FolderContent {}

export interface Folder extends BaseDatabaseEntity, FolderContent {}

export interface FoldersState {
  entities: {
    [key: string]: DatabaseFolder
  },
  ids: string[]
}
