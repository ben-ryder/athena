import {createReducer} from "@reduxjs/toolkit";
import {deleteNote, updateNoteTags} from "../notes/notes-actions";
import {v4 as createUUID} from "uuid";
import {NotesTagsState} from "./note-tags-interface";

export const initialNotesTags: NotesTagsState = {
  entities: {},
  ids: []
};

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


    builder.addCase(deleteNote, (state, action) => {
      state.ids = state.ids.filter(id => {
        const entity = state.entities[id];

        if (entity.noteId === action.payload) {
          delete state.entities[id];
          return false;
        }
        return true;
      })
    })
  }
);
