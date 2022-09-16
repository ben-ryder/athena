import {createReducer} from "@reduxjs/toolkit";
import {TaskListsTagsState} from "../open-vault-interfaces";
import {v4 as createUUID} from "uuid";
import {updateTaskListTags} from "../task-lists/task-lists-actions";

export const initialTaskListsTags: TaskListsTagsState = {
  entities: {},
  ids: []
};

export const taskListsTagsReducer = createReducer(
  initialTaskListsTags,
  (builder) => {
    builder.addCase(updateTaskListTags, (state, action) => {
      const existingTags = state.ids.filter(taskListTagId => {
        return state.entities[taskListTagId].taskListId === action.payload.id
      })

      // Remove existing tags
      state.ids = state.ids.filter(taskListTagId => !existingTags.includes(taskListTagId));
      for (const taskListTagId of existingTags) {
        delete state.entities[taskListTagId];
      }

      // Add new tags
      for (const tagId of action.payload.tags) {
        const id = createUUID();
        state.ids.push(id);
        state.entities[id] = {
          id: id,
          taskListId: action.payload.id,
          tagId: tagId
        }
      }
    })
  }
);
