import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseNoteTemplate} from "./note-templates-interface";

export const noteTemplatesAdapter = createEntityAdapter<DatabaseNoteTemplate>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
