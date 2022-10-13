import {createReducer} from "@reduxjs/toolkit";
import {createInitialDocument} from "./initial-document";
import {createNoteReducer, deleteNoteReducer, updateNoteReducer} from "./notes/notes-reducers";
import {createNote, deleteNote, updateNote} from "./notes/notes-actions";
import {createTag, deleteTag, updateTag} from "./tags/tags-actions";
import {createTagReducer, deleteTagReducer, updateTagReducer} from "./tags/tags-reducers";


export const documentReducer = createReducer(
  createInitialDocument(),
  (builder) => {
    // Notes
    builder.addCase(createNote, createNoteReducer);
    builder.addCase(updateNote, updateNoteReducer);
    builder.addCase(deleteNote, deleteNoteReducer);

    // Tags
    builder.addCase(createTag, createTagReducer);
    builder.addCase(updateTag, updateTagReducer);
    builder.addCase(deleteTag, deleteTagReducer);
  }
);
