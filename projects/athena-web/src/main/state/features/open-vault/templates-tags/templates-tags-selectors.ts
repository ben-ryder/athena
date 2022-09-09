import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";

export const selectTemplatesTagsState = (state: ApplicationState) => state.openVault.templatesTags;

export const selectTemplateId = (state: ApplicationState, templateId: string) => templateId;

export const selectTemplateTags = createSelector([selectTemplatesTagsState, selectTemplateId], (templatesTags, templateId) => {
  return templatesTags.ids
    .map(templateTagId => templatesTags.entities[templateTagId])
    .filter(templateTag => templateTag.templateId === templateId)
})
