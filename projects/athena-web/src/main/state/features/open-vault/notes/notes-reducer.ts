import {createReducer} from "@reduxjs/toolkit";

import {createNote, deleteNote, updateNote} from "./notes-actions";
import {notesAdapter} from "./notes-adapter";
import {NotesState} from "./notes-interface";

export const initialNotes: NotesState = {
  entities: {},
  ids: []
};

export const notesReducer = createReducer(
  initialNotes,
  (builder) => {
    builder.addCase(createNote, notesAdapter.addOne);
    builder.addCase(updateNote, notesAdapter.updateOne);
    builder.addCase(deleteNote, notesAdapter.removeOne);
  }
);
