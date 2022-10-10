import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";
import {ApplicationState} from "../../../store";

export const selectNoteTemplatesTagsState = (state: ApplicationState) => state.currentVault.noteTemplatesTags;

export const selectTemplateId = (state: ApplicationState, templateId: string) => templateId;

export const selectTemplateTags = createSelector([selectTagsState, selectNoteTemplatesTagsState, selectTemplateId], (tags, templatesTags, templateId) => {
  return templatesTags.ids
    .map(templateTagId => templatesTags.entities[templateTagId])
    .filter(templateTag => templateTag.templateId === templateId)
    .map(templateTag => tags.entities[templateTag.tagId])
})
