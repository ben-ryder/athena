import {ApplicationState} from "../../../store";

// Content Modals
export const selectCreateContentModal = (state: ApplicationState) => state.ui.modals.createContent;

export const selectRenameContentModal = (state: ApplicationState) => state.ui.modals.renameContent;

export const selectMoveContentModal = (state: ApplicationState) => state.ui.modals.moveContent;

export const selectDeleteContentModal = (state: ApplicationState) => state.ui.modals.deleteContent;

// Note Template
export const selectNoteTemplateFolderModal = (state: ApplicationState) => state.ui.modals.noteTemplateFolder;

// Tag Modals
export const selectDeleteTagModal = (state: ApplicationState) => state.ui.modals.deleteTag;

// Folder Modals
export const selectCreateFolderModal = (state: ApplicationState) => state.ui.modals.createFolder;

export const selectRenameFolderModal = (state: ApplicationState) => state.ui.modals.renameFolder;

export const selectMoveFolderModal = (state: ApplicationState) => state.ui.modals.moveFolder;

export const selectDeleteFolderModal = (state: ApplicationState) => state.ui.modals.deleteFolder;
