import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseNote} from "./notes-interface";

export const notesAdapter = createEntityAdapter<DatabaseNote>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
