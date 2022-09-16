import {createAction} from "@reduxjs/toolkit";
import {
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {DatabaseTaskList} from "./task-lists-interface";

export enum TaskListsActions {
  CREATE = "taskLists/create",
  UPDATE = "taskLists/update",
  UPDATE_TAGS = "taskLists/update/tags",
  DELETE = "taskLists/delete"
}

export const createTaskList= createAction<DatabaseTaskList>(TaskListsActions.CREATE);

export interface UpdateTaskListPayload {
  id: string,
  changes: Partial<DatabaseTaskList>
}
export const updateTaskList = createAction<UpdateTaskListPayload>(TaskListsActions.UPDATE);

export const updateTaskListTags = createAction<UpdateTagsPayload>(TaskListsActions.UPDATE_TAGS);

export const deleteTaskList = createAction<string>(TaskListsActions.DELETE);
