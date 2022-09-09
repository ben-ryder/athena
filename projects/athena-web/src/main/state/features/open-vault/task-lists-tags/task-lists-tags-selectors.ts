import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";

export const selectTaskListsTagsState = (state: ApplicationState) => state.openVault.taskListsTags;

export const selectTaskListId = (state: ApplicationState, taskListId: string) => taskListId;

export const selectTaskListTags = createSelector([selectTagsState, selectTaskListsTagsState, selectTaskListId], (tags, taskListsTags, taskListId) => {
  return taskListsTags.ids
    .map(taskListsTagId => taskListsTags.entities[taskListsTagId])
    .filter(taskListTag => taskListTag.taskListId === taskListId)
    .map(taskListTag => tags.entities[taskListTag.tagId])
})
