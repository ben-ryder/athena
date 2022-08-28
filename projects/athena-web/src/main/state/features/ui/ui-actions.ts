import {createAction} from "@reduxjs/toolkit";
import {UIActions} from "../../action-types";
import {Content} from "./ui-interfaces";

export const switchContent = createAction<Content>(UIActions.SWITCH_CONTENT);