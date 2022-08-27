import {Note, Tag} from "../open-vault-interfaces";
import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../state-interface";

export interface NoteData extends Note {
  tags: Tag[]
}

const selectNotes = (state: ApplicationState) => state.openVault.notes;

// @todo: move to tags
const selectNotesTags = (state: ApplicationState) => state.openVault.notesTags;
const selectTags = (state: ApplicationState) => state.openVault.tags;

export const selectNoteList = createSelector([selectNotes, selectNotesTags, selectTags], (notes, notesTags, tags) => {
  return notes.ids.map(noteId => {
    const note = notes.entities[noteId];

    const noteTags = notesTags.ids
      .filter(noteTagId => notesTags.entities[noteTagId].noteId === noteId)
      .map(noteTagId => {
        return tags.entities[notesTags.entities[noteTagId].tagId]
      });

    return {
      ...note,
      tags: noteTags
    }
  }) as NoteData[]
})
