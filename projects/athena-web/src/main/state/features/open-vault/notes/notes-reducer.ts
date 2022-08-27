import {createReducer} from "@reduxjs/toolkit";

import {createNote, deleteNote, moveNote, renameNote, updateNoteBody} from "./notes-actions";
import {notesAdapter} from "./notes-adapter";
import {NotesState} from "../open-vault-interfaces";

export const initialNotes: NotesState = {
  entities: {},
  ids: []
};

export const notesReducer = createReducer(
  initialNotes,
  (builder) => {
    builder.addCase(createNote, notesAdapter.addOne)

    builder.addCase(renameNote, (state, action) => {
      notesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          name: action.payload.name
        }
      })
    })

    builder.addCase(moveNote, (state, action) => {
      notesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          folderId: action.payload.folderId
        }
      })
    })

    builder.addCase(updateNoteBody, (state, action) => {
      notesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          body: action.payload.body
        }
      })
    })

    builder.addCase(deleteNote, (state, action) => {
      notesAdapter.removeOne(state, action.payload.id)
    })
  }
);
