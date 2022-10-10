import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../store";
import {NoteTemplate} from "./note-templates-interface";

export const selectNoteTemplatesState = (state: ApplicationState) => state.currentVault.noteTemplates;

// @todo: move to tags
const selectNoteTemplatesTags = (state: ApplicationState) => state.currentVault.noteTemplatesTags;
const selectTags = (state: ApplicationState) => state.currentVault.tags;

export const selectNoteTemplates = createSelector([selectNoteTemplatesState, selectNoteTemplatesTags, selectTags], (templates, templatesTags, tags) => {
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
  }) as NoteTemplate[]
})