import {createReducer, Draft} from "@reduxjs/toolkit";
import {createNote, deleteNote, updateNoteTags} from "../notes/notes-actions";
import {v4 as createUUID} from "uuid";
import {DocumentState} from "../document-interface";
import A from "automerge";

export function updateNoteTagsReducer(state: Draft<DocumentState>, action: ReturnType<typeof updateNoteTags>) {
  return A.change(state, doc => {

  })
}

export function deleteNoteTagsReducer(state: Draft<DocumentState>, action: ReturnType<typeof deleteNote>) {
  return A.change(state, doc => {
    for (const [x, noteTag] of state.notesTags.entries()) {
      if (noteTag.noteId === action.payload) {
        state.notesTags.remove(noteTag.id);
      }
    }
  })
}


export const notesTagsReducer = createReducer(
  initialNotesTags,
  (builder) => {
    builder.addCase(updateNoteTags, (state, action) => {
      const existingTags = state.ids.filter(noteTagId => {
        return state.entities[noteTagId].noteId === action.payload.id
      });

      // Remove existing tags
      state.ids = state.ids.filter(noteTagId => !existingTags.includes(noteTagId));
      for (const noteTagId of existingTags) {
        delete state.entities[noteTagId];
      }

      // Add new tags
      for (const tagId of action.payload.tags) {
        const id = createUUID();
        state.ids.push(id);
        state.entities[id] = {
          id: id,
          noteId: action.payload.id,
          tagId: tagId
        }
      }
    })
  }
);
