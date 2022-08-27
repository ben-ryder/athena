import {createReducer} from "@reduxjs/toolkit";
import {TaskListsState, TaskListsTagsState, TemplatesState} from "../open-vault-interfaces";

export const initialTaskListsTags: TaskListsTagsState = {
  entities: {},
  ids: []
};

export const taskListsTagsReducer = createReducer(
  initialTaskListsTags,
  (builder) => {}
);
