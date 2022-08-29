import {createAction} from "@reduxjs/toolkit";
import {Content} from "./content-interface";

export enum UIContentActions {
  SWITCH_CONTENT = "content/openAndSwitch",
  CLOSE_CONTENT = "content/close"
}

export const openAndSwitchContent = createAction<Content>(UIContentActions.SWITCH_CONTENT);

export const closeContent = createAction<Content>(UIContentActions.CLOSE_CONTENT);
