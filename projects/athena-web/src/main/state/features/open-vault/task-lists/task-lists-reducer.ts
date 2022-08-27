import {createReducer} from "@reduxjs/toolkit";
import {TaskListsState, TemplatesState} from "../open-vault-interfaces";

export const initialTaskLists: TaskListsState = {
  entities: {},
  ids: []
};

export const taskListsReducer = createReducer(
  initialTaskLists,
  (builder) => {}
);
