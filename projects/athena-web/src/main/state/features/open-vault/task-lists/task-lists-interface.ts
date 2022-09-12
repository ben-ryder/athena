import {BaseDatabaseEntity} from "../../../common/base-database-entity";

export interface TaskListContent {
  name: string,
  folderId: string | null
}

export interface DatabaseTaskList extends BaseDatabaseEntity, TaskListContent {}

export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}

export interface TaskContent {
  name: string,
  status: TaskStatus,
  taskListId: string
}
export interface DatabaseTask extends BaseDatabaseEntity, TaskContent {}

export interface TaskListState {
  entities: {
    [key: string]: DatabaseTaskList
  },
  ids: string[]
}

export interface TasksState {
  entities: {
    [key: string]: DatabaseTask
  },
  ids: string[]
}
