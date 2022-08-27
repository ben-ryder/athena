import {createReducer} from "@reduxjs/toolkit";
import {NotesTagsState} from "../open-vault-interfaces";

export const initialNotesTags: NotesTagsState = {
  entities: {},
  ids: []
};

export const notesTagsReducer = createReducer(
  initialNotesTags,
  (builder) => {}
);
