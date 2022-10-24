import {createAction, createReducer} from "@reduxjs/toolkit";
import {DocumentState} from "./document-interface";

export const updateDocument = createAction<DocumentState>("document/update");

export const documentReducer = createReducer(createInitialDocument(), (builder) => {
  builder.addCase(updateDocument, (state, action) => {
    return action.payload;
  })
});
