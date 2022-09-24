import {ApplicationState} from "../../../../store";
import {createSelector} from "@reduxjs/toolkit";

export const selectTasksState = (state: ApplicationState) => state.currentVault.tasks;

export const selectTaskListId = (state: ApplicationState, taskListId: string) => taskListId;

export const selectTasks = createSelector([selectTasksState, selectTaskListId], (tasksState, taskListId) => {
  return tasksState.ids
    .filter(id => {
      return tasksState.entities[id].taskListId === taskListId
    })
    .map(id => tasksState.entities[id])
});
