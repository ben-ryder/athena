import {createAction} from "@reduxjs/toolkit";
import {ListViewSection, ViewModes} from "./view-interface";

export enum UIViewActions {
  SWITCH_VIEW_MODE = "view/switch/viewMode"
}

export const switchCurrentViewMode = createAction<ViewModes>(UIViewActions.SWITCH_VIEW_MODE);
