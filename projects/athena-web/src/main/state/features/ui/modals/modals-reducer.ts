import {UIModalsState} from "./modals-interface";
import {createReducer} from "@reduxjs/toolkit";
import {closeDeleteModal, closeRenameModal, openDeleteModal, openRenameModal} from "./modals-actions";

export const initialUIModalsState: UIModalsState = {
  renameContent: {
    isOpen: false,
    content: null
  },
  deleteContent: {
    isOpen: false,
    content: null
  }
};

export const uiModalsReducer = createReducer(
  initialUIModalsState,
  (builder) => {
    builder.addCase(openRenameModal, (state, action) => {
      state.renameContent.isOpen = true;
      state.renameContent.content = action.payload;
    })

    builder.addCase(closeRenameModal, (state) => {
      state.renameContent.isOpen = false;
      state.renameContent.content = null;
    })

    builder.addCase(openDeleteModal, (state, action) => {
      state.deleteContent.isOpen = true;
      state.deleteContent.content = action.payload;
    })

    builder.addCase(closeDeleteModal, (state) => {
      state.deleteContent.isOpen = false;
      state.deleteContent.content = null;
    })
  }
);
