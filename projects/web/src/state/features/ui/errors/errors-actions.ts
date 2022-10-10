import {createAction} from "@reduxjs/toolkit";
import {ApplicationError} from "./errors-interface";

export enum UIErrorsActions {
  // Application Error
  SET_APPLICATION_ERROR = "errors/application/set",
  CLEAR_APPLICATION_ERROR = "errors/application/clear",
}

export const setApplicationError = createAction<ApplicationError>(UIErrorsActions.SET_APPLICATION_ERROR);

export const clearApplicationError = createAction(UIErrorsActions.CLEAR_APPLICATION_ERROR);
