import {createAction} from "@reduxjs/toolkit";
import {Content} from "./content-interface";

export enum UIContentActions {
  // Content List
  OPEN_NOTE = "open/note",
  OPEN_TEMPLATE = "open/template",
  OPEN_LIST= "open/taskList",

  SWITCH_CONTENT = "content/switch",
  CLOSE_CONTENT = "content/close"
}

export const switchContent = createAction<Content>(UIContentActions.SWITCH_CONTENT);
