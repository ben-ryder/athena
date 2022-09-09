import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";

export const selectNotesTagsState = (state: ApplicationState) => state.openVault.notesTags;

export const selectNoteId = (state: ApplicationState, noteId: string) => noteId;

export const selectNoteTags = createSelector([selectNotesTagsState, selectNoteId], (notesTags, noteId) => {
  return notesTags.ids
    .map(noteTagId => notesTags.entities[noteTagId])
    .filter(noteTag => noteTag.noteId === noteId)
})
