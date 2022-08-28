import {Tag, Template} from "../open-vault-interfaces";
import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";
import {NoteData} from "../notes/notes-selectors";
import {TemplateCardProps} from "../../../../../patterns/components/content-card/content-card";

export interface TemplateData extends Template {
  tags: Tag[]
}

const selectRawTemplates = (state: ApplicationState) => state.openVault.templates;

// @todo: move to tags
const selectTemplatesTags = (state: ApplicationState) => state.openVault.templatesTags;
const selectTags = (state: ApplicationState) => state.openVault.tags;

export const selectTemplates = createSelector([selectRawTemplates, selectTemplatesTags, selectTags], (templates, templatesTags, tags) => {
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
  }) as TemplateData[]
})