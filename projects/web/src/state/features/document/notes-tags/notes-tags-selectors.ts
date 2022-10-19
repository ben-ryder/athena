import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";
import {ApplicationState} from "../../../store";

export const selectNotesTagsState = (state: ApplicationState) => state.document.notesTags;

export const selectNoteId = (state: ApplicationState, noteId: string) => noteId;

export const selectNoteTags = createSelector([selectTagsState, selectNotesTagsState, selectNoteId], (tags, notesTags, noteId) => {
  return notesTags.ids
    .map(noteTagId => notesTags.byId(noteTagId))
    .filter(noteTag => noteTag.noteId === noteId)
    .map(noteTag => tags.byId(noteTag.tagId))
})
