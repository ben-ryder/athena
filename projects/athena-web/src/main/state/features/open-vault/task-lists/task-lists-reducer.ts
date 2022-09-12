import {createReducer} from "@reduxjs/toolkit";

import {createTaskList, deleteTaskList, updateTaskList} from "./task-lists-actions";
import {taskListsAdapter} from "./task-lists-adapter";
import {NotesState} from "../notes/notes-interface";

export const initialNotes: NotesState = {
  entities: {},
  ids: []
};

export const taskListsReducer = createReducer(
  initialNotes,
  (builder) => {
    builder.addCase(createTaskList, taskListsAdapter.addOne)
    builder.addCase(updateTaskList, taskListsAdapter.updateOne);
    builder.addCase(deleteTaskList, taskListsAdapter.removeOne);
  }
);
