import {createReducer} from "@reduxjs/toolkit";
import {createNote} from "../../open-vault/notes/notes-actions";
import {ContentType, UIContentState} from "./content-interface";
import {createTemplate} from "../../open-vault/templates/templates-actions";
import {switchContent} from "./content-actions";


export const initialUIContentState: UIContentState = {
  openContent: [],
  activeContent: null
};

export const uiContentReducer = createReducer(
  initialUIContentState,
  (builder) => {
    builder.addCase(createNote, (state, action) => {
      const content = {
        type: ContentType.NOTE,
        id: action.payload.id
      };

      state.openContent.push(content);
      state.activeContent = content;
    })

    builder.addCase(createTemplate, (state, action) => {
      const content = {
        type: ContentType.TEMPLATE,
        id: action.payload.id
      };

      state.openContent.push(content);
      state.activeContent = content;
    })

    builder.addCase(switchContent, (state, action) => {
      state.activeContent = action.payload;
    })
  }
);
