import {createReducer} from "@reduxjs/toolkit";
import {ContentType, UIContentState} from "./content-interface";
import {closeContent, openAndSwitchContent} from "./content-actions";


export const initialUIContentState: UIContentState = {
  openContent: [],
  activeContent: null
};

export const uiContentReducer = createReducer(
  initialUIContentState,
  (builder) => {
    // builder.addCase(createNote, (state, action) => {
    //   const content = {
    //     type: ContentType.NOTE,
    //     id: action.payload.id
    //   };
    //
    //   state.openContent.push(content);
    //   state.activeContent = content;
    // })
    //
    // builder.addCase(createNoteTemplate, (state, action) => {
    //   const content = {
    //     type: ContentType.NOTE_TEMPLATE,
    //     id: action.payload.id
    //   };
    //
    //   state.openContent.push(content);
    //   state.activeContent = content;
    // })
    //
    // builder.addCase(createTaskList, (state, action) => {
    //   const content = {
    //     type: ContentType.TASK_LIST,
    //     id: action.payload.id
    //   };
    //
    //   state.openContent.push(content);
    //   state.activeContent = content;
    // })

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

    // builder.addCase(deleteNote, (state, action) => {
    //   if (state.activeContent?.id === action.payload) {
    //     state.activeContent = null;
    //   }
    //
    //   state.openContent = state.openContent.filter(content => {
    //     return content.id !== action.payload;
    //   })
    // })
    //
    // builder.addCase(deleteNoteTemplate, (state, action) => {
    //   if (state.activeContent?.id === action.payload) {
    //     state.activeContent = null;
    //   }
    //
    //   state.openContent = state.openContent.filter(content => {
    //     return content.id !== action.payload;
    //   })
    // })
    //
    // builder.addCase(deleteTaskList, (state, action) => {
    //   if (state.activeContent?.id === action.payload) {
    //     state.activeContent = null;
    //   }
    //
    //   state.openContent = state.openContent.filter(content => {
    //     return content.id !== action.payload;
    //   })
    // })
  }
);
