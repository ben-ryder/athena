import {ApplicationState} from "../../../state-interface";

export const selectRenameModal = (state: ApplicationState) => state.ui.modals.renameContent;
