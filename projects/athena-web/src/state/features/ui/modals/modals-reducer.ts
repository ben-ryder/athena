import {UIModalsState} from "./modals-interface";
import {createReducer} from "@reduxjs/toolkit";
import {
  closeCreateContentModal,
  closeDeleteContentModal, closeDeleteTagModal, closeMoveContentModal,
  closeRenameContentModal,
  openCreateContentModal,
  openDeleteContentModal, openDeleteTagModal, openMoveContentModal,
  openRenameContentModal
} from "./modals-actions";

export const initialUIModalsState: UIModalsState = {
  createContent: {
    isOpen: false,
    type: null
  },
  renameContent: {
    isOpen: false,
    content: null
  },
  moveContent: {
    isOpen: false,
    content: null
  },
  deleteContent: {
    isOpen: false,
    content: null
  },

  deleteTag: {
    isOpen: false,
    tag: null
  }
};

export const uiModalsReducer = createReducer(
  initialUIModalsState,
  (builder) => {
    // Content Modals
    builder.addCase(openCreateContentModal, (state, action) => {
      state.createContent.isOpen = true;
      state.createContent.type = action.payload;
    })

    builder.addCase(closeCreateContentModal, (state) => {
      state.createContent.isOpen = false;
      state.createContent.type = null;
    })

    builder.addCase(openRenameContentModal, (state, action) => {
      state.renameContent.isOpen = true;
      state.renameContent.content = action.payload;
    })

    builder.addCase(closeRenameContentModal, (state) => {
      state.renameContent.isOpen = false;
      state.renameContent.content = null;
    })

    builder.addCase(openMoveContentModal, (state, action) => {
      state.moveContent.isOpen = true;
      state.moveContent.content = action.payload;
    })

    builder.addCase(closeMoveContentModal, (state) => {
      state.moveContent.isOpen = false;
      state.moveContent.content = null;
    })

    builder.addCase(openDeleteContentModal, (state, action) => {
      state.deleteContent.isOpen = true;
      state.deleteContent.content = action.payload;
    })

    builder.addCase(closeDeleteContentModal, (state) => {
      state.deleteContent.isOpen = false;
      state.deleteContent.content = null;
    })

    // Tag Modals
    builder.addCase(openDeleteTagModal, (state, action) => {
      state.deleteTag.isOpen = true;
      state.deleteTag.tag = action.payload;
    })

    builder.addCase(closeDeleteTagModal, (state) => {
      state.deleteTag.isOpen = false;
      state.deleteTag.tag = null;
    })
  }
);
