import {ApplicationState} from "../../../state-interface";

export const selectRenameModal = (state: ApplicationState) => state.ui.modals.renameContent;

export const selectDeleteModal = (state: ApplicationState) => state.ui.modals.deleteContent;

export const selectCreateModal = (state: ApplicationState) => state.ui.modals.createContent;
