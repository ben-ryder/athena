import {UIModalsState} from "./modals-interface";
import {createReducer} from "@reduxjs/toolkit";
import {
  closeCreateContentModal,
  closeCreateFolderModal,
  closeDeleteContentModal,
  closeDeleteFolderModal,
  closeDeleteTagModal,
  closeMoveContentModal,
  closeMoveFolderModal,
  closeNoteTemplateFolderModal,
  closeRenameContentModal,
  closeRenameFolderModal,
  openCreateContentModal,
  openCreateFolderModal,
  openDeleteContentModal,
  openDeleteFolderModal,
  openDeleteTagModal,
  openMoveContentModal,
  openMoveFolderModal,
  openNoteTemplateFolderModal,
  openRenameContentModal,
  openRenameFolderModal
} from "./modals-actions";

export const initialUIModalsState: UIModalsState = {
  // Content Modals
  createContent: {
    isOpen: false,
    type: null,
    targetFolderId: null
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

  // Note Template
  noteTemplateFolder: {
    isOpen: false,
    noteTemplate: null
  },

  // Tag Modals
  deleteTag: {
    isOpen: false,
    tag: null
  },

  // Folder Modals
  createFolder: {
    isOpen: false,
    targetFolderId: null
  },
  renameFolder: {
    isOpen: false,
    folder: null
  },
  moveFolder: {
    isOpen: false,
    folder: null
  },
  deleteFolder: {
    isOpen: false,
    folder: null
  },
};

export const uiModalsReducer = createReducer(
  initialUIModalsState,
  (builder) => {
    // Content Modals
    builder.addCase(openCreateContentModal, (state, action) => {
      state.createContent.isOpen = true;
      state.createContent.type = action.payload.contentType;
      state.createContent.targetFolderId = action.payload.targetFolderId;
    })

    builder.addCase(closeCreateContentModal, (state) => {
      state.createContent.isOpen = false;
      state.createContent.type = null;
      state.createContent.targetFolderId = null;
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

    // Note Template
    builder.addCase(openNoteTemplateFolderModal, (state, action) => {
      state.noteTemplateFolder.isOpen = true;
      state.noteTemplateFolder.noteTemplate = action.payload;
    })

    builder.addCase(closeNoteTemplateFolderModal, (state, action) => {
      state.noteTemplateFolder.isOpen = false;
      state.noteTemplateFolder.noteTemplate = null;
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

    // Folder Modals
    builder.addCase(openCreateFolderModal, (state, action) => {
      state.createFolder.isOpen = true;
      state.createFolder.targetFolderId = action.payload;
    })

    builder.addCase(closeCreateFolderModal, (state) => {
      state.createFolder.isOpen = false;
      state.createFolder.targetFolderId = null;
    })

    builder.addCase(openRenameFolderModal, (state, action) => {
      state.renameFolder.isOpen = true;
      state.renameFolder.folder = action.payload;
    })

    builder.addCase(closeRenameFolderModal, (state) => {
      state.renameFolder.isOpen = false;
      state.renameFolder.folder = null;
    })

    builder.addCase(openMoveFolderModal, (state, action) => {
      state.moveFolder.isOpen = true;
      state.moveFolder.folder = action.payload;
    })

    builder.addCase(closeMoveFolderModal, (state) => {
      state.moveFolder.isOpen = false;
      state.moveFolder.folder = null;
    })

    builder.addCase(openDeleteFolderModal, (state, action) => {
      state.deleteFolder.isOpen = true;
      state.deleteFolder.folder = action.payload;
    })

    builder.addCase(closeDeleteFolderModal, (state) => {
      state.deleteFolder.isOpen = false;
      state.deleteFolder.folder = null;
    })
  }
);
