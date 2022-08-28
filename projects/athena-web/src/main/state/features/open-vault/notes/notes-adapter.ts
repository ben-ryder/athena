import {createEntityAdapter} from "@reduxjs/toolkit";
import {Note} from "../open-vault-interfaces";


export const notesAdapter = createEntityAdapter<Note>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
