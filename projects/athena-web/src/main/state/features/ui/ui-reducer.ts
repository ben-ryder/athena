import {createReducer} from "@reduxjs/toolkit";
import {createNote} from "../open-vault/notes/notes-actions";
import {ContentType, UIState} from "./ui-interfaces";

export const initialUIState: UIState = {
  currentUser: null,
  currentVault:  null,
  content: {
    openContent: [],
    activeContent: null
  }
};

export const uiReducer = createReducer(
  initialUIState,
  (builder) => {
    builder.addCase(createNote, (state, action) => {
      state.content.openContent.push({
        type: ContentType.NOTE,
        id: action.payload.id
      });
    })
  }
);
