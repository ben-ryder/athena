import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";

export const selectTaskListsTagsState = (state: ApplicationState) => state.openVault.taskListsTags;

export const selectTaskListId = (state: ApplicationState, taskListId: string) => taskListId;

export const selectTaskListTags = createSelector([selectTaskListsTagsState, selectTaskListId], (taskListsTags, taskListId) => {
  return taskListsTags.ids
    .map(taskListsTagId => taskListsTags.entities[taskListsTagId])
    .filter(noteTag => noteTag.taskListId === taskListId)
})
