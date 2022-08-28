import {createReducer} from "@reduxjs/toolkit";
import {createNote} from "../open-vault/notes/notes-actions";
import {ContentType, UIState} from "./ui-interfaces";
import {createTemplate} from "../open-vault/templates/templates-actions";
import {switchContent} from "./ui-actions";

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
      const content = {
        type: ContentType.NOTE,
        id: action.payload.id
      };

      state.content.openContent.push(content);
      state.content.activeContent = content;
    })

    builder.addCase(createTemplate, (state, action) => {
      const content = {
        type: ContentType.TEMPLATE,
        id: action.payload.id
      };

      state.content.openContent.push(content);
      state.content.activeContent = content;
    })

    builder.addCase(switchContent, (state, action) => {
      state.content.activeContent = action.payload;
    })
  }
);
