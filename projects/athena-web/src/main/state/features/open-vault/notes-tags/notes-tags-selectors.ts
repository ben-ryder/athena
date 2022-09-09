import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";

export const selectNotesTagsState = (state: ApplicationState) => state.openVault.notesTags;

export const selectNoteId = (state: ApplicationState, noteId: string) => noteId;

export const selectNoteTags = createSelector([selectTagsState, selectNotesTagsState, selectNoteId], (tags, notesTags, noteId) => {
  return notesTags.ids
    .map(noteTagId => notesTags.entities[noteTagId])
    .filter(noteTag => noteTag.noteId === noteId)
    .map(noteTag => tags.entities[noteTag.tagId])
})
