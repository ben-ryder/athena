import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";
import {ApplicationState} from "../../../store";
import {Tag} from "../document-interface";

export const selectTaskListTagsState = (state: ApplicationState) => state.document.taskListsTags;

export const selectTaskListId = (state: ApplicationState, taskListId: string) => taskListId;

export const selectTaskListTags = createSelector([selectTagsState, selectTaskListTagsState, selectTaskListId], (tags, taskListsTags, taskListId) => {
 return taskListsTags.ids
    .map(taskListTagId => taskListsTags.byId(taskListTagId))
    .filter(taskListTag => taskListTag.taskListId === taskListId)
    .map(taskListsTag => tags.byId(taskListsTag.tagId)) as Tag[]
})
