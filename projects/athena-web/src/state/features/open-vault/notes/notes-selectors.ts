import {ApplicationState} from "../../../store";

export const selectNotesState = (state: ApplicationState) => state.openVault.notes;
