import {createReducer} from "@reduxjs/toolkit";
import {createNote} from "../../open-vault/notes/notes-actions";
import {Content, ContentType, UIContentState} from "./content-interface";
import {createTemplate} from "../../open-vault/templates/templates-actions";
import {closeContent, openAndSwitchContent} from "./content-actions";


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

    builder.addCase(openAndSwitchContent, (state, action) => {
      state.activeContent = action.payload;

      let contentIsOpen = false;
      for (const content of state.openContent) {
        if (content.id === action.payload.id) {
          contentIsOpen = true;
          break;
        }
      }

      if (!contentIsOpen) {
        state.openContent.push(action.payload);
      }
    })

    builder.addCase(closeContent, (state, action) => {
      state.openContent = state.openContent.filter(content => {
        return JSON.stringify(content) !== JSON.stringify(action.payload);
      })

      if (JSON.stringify(state.activeContent) === JSON.stringify(action.payload)) {
        state.activeContent = null;
      }
    })
  }
);
