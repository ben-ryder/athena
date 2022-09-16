import {ApplicationState} from "../../../store";


export const selectRenameContentModal = (state: ApplicationState) => state.ui.modals.renameContent;

export const selectDeleteContentModal = (state: ApplicationState) => state.ui.modals.deleteContent;

export const selectCreateContentModal = (state: ApplicationState) => state.ui.modals.createContent;

export const selectDeleteTagModal = (state: ApplicationState) => state.ui.modals.deleteTag;
