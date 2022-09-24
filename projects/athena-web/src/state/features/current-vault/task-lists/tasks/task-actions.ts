import {createAction} from "@reduxjs/toolkit";
import {DatabaseTask, TaskContent} from "./task-interface";

export enum TaskActions {
  CREATE = "tasks/create",
  UPDATE = "tasks/update",
  DELETE = "tasks/delete"
}

export const createTask = createAction<DatabaseTask>(TaskActions.CREATE);

export interface UpdateTaskPayload {
  id: string,
  changes:  Partial<DatabaseTask>
}
export const updateTask = createAction<UpdateTaskPayload>(TaskActions.UPDATE);

export const deleteTask = createAction<string>(TaskActions.DELETE);
