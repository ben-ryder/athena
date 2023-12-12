import { Entity, EntityTable } from "../../common/entity.types";
import { OrderByFields, OrderDirection } from "../../common/lists.types";

/**
 * Tasks
 */
export interface TaskContent {
  name: string;
  tags: string[];
}
export interface TaskEntity extends Entity, TaskContent {}
export type TasksTable = EntityTable<TaskEntity>;

/**
 * Task Views
 */
export interface TaskViewContent {
  name: string
  tags: string[]
  orderBy: OrderByFields;
  orderDirection: OrderDirection;
}
export interface TaskViewEntity extends Entity, TaskViewContent {}
export type TaskViewsTable = EntityTable<TaskViewEntity>;
