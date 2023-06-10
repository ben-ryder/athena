import {Entity, EntityTable} from "./entity";

/**
 * Tasks
 * ========================
 */
export interface TaskContent {
  name: string,
  tags: string[],
  reminderRRULE?: string
}
export interface TaskEntity extends Entity, TaskContent {}
export type TasksTable = EntityTable<TaskEntity>;
