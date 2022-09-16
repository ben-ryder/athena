import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../store";
import {Template} from "./templates-interface";

export const selectTemplatesState = (state: ApplicationState) => state.openVault.templates;

// @todo: move to tags
const selectTemplatesTags = (state: ApplicationState) => state.openVault.templatesTags;
const selectTags = (state: ApplicationState) => state.openVault.tags;

export const selectTemplates = createSelector([selectTemplatesState, selectTemplatesTags, selectTags], (templates, templatesTags, tags) => {
  return templates.ids.map(templateId => {
    const template = templates.entities[templateId];

    const templateTags = templatesTags.ids
      .filter(templateTagId => templatesTags.entities[templateTagId].templateId === templateId)
      .map(templateTagId => {
        return tags.entities[templatesTags.entities[templateTagId].tagId]
      });

    return {
      ...template,
      tags: templateTags
    }
  }) as Template[]
})