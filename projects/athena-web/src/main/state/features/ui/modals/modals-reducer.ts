import {UIModalsState} from "./modals-interface";
import {createReducer} from "@reduxjs/toolkit";
import {
  closeCreateModal,
  closeDeleteModal,
  closeRenameModal,
  openCreateModal,
  openDeleteModal,
  openRenameModal
} from "./modals-actions";

export const initialUIModalsState: UIModalsState = {
  renameContent: {
    isOpen: false,
    content: null
  },
  deleteContent: {
    isOpen: false,
    content: null
  },
  createContent: {
    isOpen: false,
    type: null
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

    builder.addCase(openCreateModal, (state, action) => {
      state.createContent.isOpen = true;
      state.createContent.type = action.payload;
    })

    builder.addCase(closeCreateModal, (state) => {
      state.createContent.isOpen = false;
      state.createContent.type = null;
    })
  }
);
