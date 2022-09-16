import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";
import {ApplicationState} from "../../../store";

export const selectTemplatesTagsState = (state: ApplicationState) => state.currentVault.templatesTags;

export const selectTemplateId = (state: ApplicationState, templateId: string) => templateId;

export const selectTemplateTags = createSelector([selectTagsState, selectTemplatesTagsState, selectTemplateId], (tags, templatesTags, templateId) => {
  return templatesTags.ids
    .map(templateTagId => templatesTags.entities[templateTagId])
    .filter(templateTag => templateTag.templateId === templateId)
    .map(templateTag => tags.entities[templateTag.tagId])
})
