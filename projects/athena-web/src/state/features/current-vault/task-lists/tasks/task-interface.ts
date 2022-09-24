import {BaseDatabaseEntity} from "../../../../common/base-database-entity";

export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}

export interface TaskContent {
  name: string,
  status: TaskStatus
}
export interface DatabaseTask extends BaseDatabaseEntity, TaskContent {
  taskListId: string
}

export interface TasksState {
  entities: {
    [key: string]: DatabaseTask
  },
  ids: string[]
}
