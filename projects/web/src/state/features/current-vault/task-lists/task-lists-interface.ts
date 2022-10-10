import {BaseDatabaseEntity} from "../../../common/base-database-entity";

export interface TaskListContent {
  name: string,
  folderId: string | null
}

export interface DatabaseTaskList extends BaseDatabaseEntity, TaskListContent {}

export interface TaskListsState {
  entities: {
    [key: string]: DatabaseTaskList
  },
  ids: string[]
}
