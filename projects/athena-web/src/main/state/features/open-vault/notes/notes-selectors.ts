import {ApplicationState} from "../../../state-interface";

export const selectNotesState = (state: ApplicationState) => state.openVault.notes;
