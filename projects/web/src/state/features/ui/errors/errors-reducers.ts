import {createReducer} from "@reduxjs/toolkit";
import {UIErrorsState} from "./errors-interface";
import {clearApplicationError, setApplicationError} from "./errors-actions";

export const initialUIErrorsState: UIErrorsState = {
  applicationError: null
};

export const uiErrorsReducer = createReducer(
  initialUIErrorsState,
  (builder) => {
    // Content Modals
    builder.addCase(setApplicationError, (state, action) => {
      state.applicationError = action.payload;
    })

    builder.addCase(clearApplicationError, (state) => {
      state.applicationError = null;
    })
  }
);
