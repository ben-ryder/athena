import {createAction} from "@reduxjs/toolkit";
import {
  DeleteActionPayload,
  MoveActionPayload,
  RenameActionPayload,
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {Note, TaskList} from "../open-vault-interfaces";

export enum TaskListsActions {
  CREATE = "taskLists/create",
  RENAME = "taskLists/update/rename",
  UPDATE_TAGS = "taskLists/update/tags",
  MOVE = "taskLists/update/move",
  DELETE = "taskLists/delete"
}

export const createTaskList= createAction<TaskList>(TaskListsActions.CREATE);

export const renameTaskList = createAction<RenameActionPayload>(TaskListsActions.RENAME);

export const moveTaskList = createAction<MoveActionPayload>(TaskListsActions.MOVE);

export const updateTaskListTags = createAction<UpdateTagsPayload>(TaskListsActions.UPDATE_TAGS);

export const deleteTaskList = createAction<DeleteActionPayload>(TaskListsActions.DELETE);
