import {createReducer} from "@reduxjs/toolkit";

import {createTaskList, deleteTaskList, moveTaskList, renameTaskList} from "./task-lists-actions";
import {taskListsAdapter} from "./task-lists-adapter";
import {NotesState} from "../open-vault-interfaces";

export const initialNotes: NotesState = {
  entities: {},
  ids: []
};

export const taskListsReducer = createReducer(
  initialNotes,
  (builder) => {
    builder.addCase(createTaskList, taskListsAdapter.addOne)

    builder.addCase(renameTaskList, (state, action) => {
      taskListsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          name: action.payload.name
        }
      })
    })

    builder.addCase(moveTaskList, (state, action) => {
      taskListsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          folderId: action.payload.folderId
        }
      })
    })

    builder.addCase(deleteTaskList, (state, action) => {
      taskListsAdapter.removeOne(state, action.payload.id)
    })
  }
);
