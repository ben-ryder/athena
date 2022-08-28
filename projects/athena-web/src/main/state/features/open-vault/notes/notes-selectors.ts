import {Note, Tag} from "../open-vault-interfaces";
import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../state-interface";

export interface NoteData extends Note {
  tags: Tag[]
}

export const selectNoteList = (state: ApplicationState) => state.openVault.notes.ids;
const selectNotes = (state: ApplicationState) => state.openVault.notes;
const selectNoteId = (state: ApplicationState, noteId: string) => noteId;

// @todo: move to tags
const selectNoteTags = (state: ApplicationState, noteId: string) => {
  return state.openVault.notesTags.ids
    .map(noteTagId => state.openVault.notesTags.entities[noteTagId])
    .filter(noteTag => noteTag.noteId === noteId)
    .map(noteTag => state.openVault.tags.entities[noteTag.tagId])
};

export const selectNote = createSelector([selectNotes, selectNoteTags, selectNoteId], (notes, noteTags, noteId) => {
  return {
    ...notes.entities[noteId],
    tags: noteTags
  } as NoteData;
})
