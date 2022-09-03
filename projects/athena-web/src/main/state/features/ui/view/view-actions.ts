import {createAction} from "@reduxjs/toolkit";
import {ListViewFilters, ViewModes} from "./view-interface";

export enum UIViewActions {
  SWITCH_VIEW_MODE = "viewMode/switch",
  UPDATE_FILTERS = "listFilters/update",
  RESET_FILTERS = "listFilters/reset",
  PAGE_INCREMENT = "listPage/increment",
  PAGE_DECREMENT = "listPage/decrement"
}

export const switchCurrentViewMode = createAction<ViewModes>(UIViewActions.SWITCH_VIEW_MODE);

export const updateListFilters = createAction<ListViewFilters>(UIViewActions.UPDATE_FILTERS);

export const resetListFilters = createAction(UIViewActions.RESET_FILTERS);

export const incrementPage = createAction(UIViewActions.PAGE_INCREMENT);

export const decrementPage = createAction(UIViewActions.PAGE_DECREMENT);
