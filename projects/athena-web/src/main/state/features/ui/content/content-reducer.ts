import {createReducer} from "@reduxjs/toolkit";
import {createNote, deleteNote} from "../../open-vault/notes/notes-actions";
import {ContentType, UIContentState} from "./content-interface";
import {createTemplate, deleteTemplate} from "../../open-vault/templates/templates-actions";
import {closeContent, openAndSwitchContent} from "./content-actions";
import {createTaskList, deleteTaskList} from "../../open-vault/task-lists/task-lists-actions";


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

    builder.addCase(createTaskList, (state, action) => {
      const content = {
        type: ContentType.TASK_LIST,
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

    builder.addCase(deleteNote, (state, action) => {
      if (state.activeContent?.id === action.payload) {
        state.activeContent = null;
      }

      state.openContent = state.openContent.filter(content => {
        return content.id !== action.payload;
      })
    })

    builder.addCase(deleteTemplate, (state, action) => {
      if (state.activeContent?.id === action.payload.id) {
        state.activeContent = null;
      }

      state.openContent = state.openContent.filter(content => {
        return content.id !== action.payload.id;
      })
    })

    builder.addCase(deleteTaskList, (state, action) => {
      if (state.activeContent?.id === action.payload.id) {
        state.activeContent = null;
      }

      state.openContent = state.openContent.filter(content => {
        return content.id !== action.payload.id;
      })
    })
  }
);
