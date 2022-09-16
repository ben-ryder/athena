import {createReducer} from "@reduxjs/toolkit";
import {
  createNoteTemplate,
  deleteNoteTemplate,
  updateNoteTemplate,
} from "./note-templates-actions";
import {noteTemplatesAdapter} from "./note-templates-adapter";
import {NoteTemplatesState} from "./note-templates-interface";

export const initialNoteTemplates: NoteTemplatesState = {
  entities: {},
  ids: []
};

export const noteTemplatesReducer = createReducer(
  initialNoteTemplates,
  (builder) => {
    builder.addCase(createNoteTemplate, noteTemplatesAdapter.addOne)
    builder.addCase(updateNoteTemplate, noteTemplatesAdapter.updateOne);
    builder.addCase(deleteNoteTemplate, noteTemplatesAdapter.removeOne);
  }
);
