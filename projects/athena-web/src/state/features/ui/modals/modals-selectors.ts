import {ApplicationState} from "../../../store";

export const selectCreateContentModal = (state: ApplicationState) => state.ui.modals.createContent;

export const selectRenameContentModal = (state: ApplicationState) => state.ui.modals.renameContent;

export const selectMoveContentModal = (state: ApplicationState) => state.ui.modals.moveContent;

export const selectDeleteContentModal = (state: ApplicationState) => state.ui.modals.deleteContent;

export const selectDeleteTagModal = (state: ApplicationState) => state.ui.modals.deleteTag;
