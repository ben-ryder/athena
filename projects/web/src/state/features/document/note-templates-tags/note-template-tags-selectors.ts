import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";
import {ApplicationState} from "../../../store";
import {Tag} from "../document-interface";

export const selectNoteTemplateTagsState = (state: ApplicationState) => state.document.noteTemplatesTags;

export const selectNoteTemplateId = (state: ApplicationState, noteTemplateId: string) => noteTemplateId;

export const selectNoteTemplateTags = createSelector([selectTagsState, selectNoteTemplateTagsState, selectNoteTemplateId], (tags, noteTemplateTags, noteTemplateId) => {
  return noteTemplateTags.ids
    .map(noteTemplateTagId => noteTemplateTags.byId(noteTemplateTagId))
    .filter(noteTemplateTag => noteTemplateTag.templateId === noteTemplateId)
    .map(noteTemplateTag => tags.byId(noteTemplateTag.tagId)) as Tag[]
})
