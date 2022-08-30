import {Note, Tag} from "../open-vault-interfaces";
import {ApplicationState} from "../../../state-interface";

export interface NoteData extends Note {
  tags: Tag[]
}

export const selectNotesState = (state: ApplicationState) => state.openVault.notes;
