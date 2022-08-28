import {createAction} from "@reduxjs/toolkit";
import {ListViewSection, ViewModes} from "./view-interface";

export enum UIViewActions {
  SWITCH_VIEW_MODE = "SWITCH_VIEW_MODE",
  SWITCH_LIST_VIEW_SECTION = "SWITCH_LIST_VIEW_SECTION"
}

export const switchCurrentViewMode = createAction<ViewModes>(UIViewActions.SWITCH_VIEW_MODE);

export const switchCurrentListViewSection = createAction<ListViewSection>(UIViewActions.SWITCH_LIST_VIEW_SECTION);
