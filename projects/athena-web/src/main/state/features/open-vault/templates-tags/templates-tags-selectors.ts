import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "../tags/tags-selectors";

export const selectTemplatesTagsState = (state: ApplicationState) => state.openVault.templatesTags;

export const selectTemplateId = (state: ApplicationState, templateId: string) => templateId;

export const selectTemplateTags = createSelector([selectTagsState, selectTemplatesTagsState, selectTemplateId], (tags, templatesTags, templateId) => {
  return templatesTags.ids
    .map(templateTagId => templatesTags.entities[templateTagId])
    .filter(templateTag => templateTag.templateId === templateId)
    .map(templateTag => tags.entities[templateTag.tagId])
})
