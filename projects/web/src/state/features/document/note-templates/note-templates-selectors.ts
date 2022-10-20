import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../store";
import {NoteTemplate} from "../document-interface";

export const selectNoteTemplatesState = (state: ApplicationState) => state.document.noteTemplates;

// @todo: move to tags
const selectNoteTemplatesTags = (state: ApplicationState) => state.document.noteTemplatesTags;
const selectTags = (state: ApplicationState) => state.document.tags;

export const selectNoteTemplates = createSelector([selectNoteTemplatesState, selectNoteTemplatesTags, selectTags], (templates, templatesTags, tags) => {
  return templates.ids.map(templateId => {
    const template = templates.byId(templateId);

    const templateTags = templatesTags.ids
      .filter(templateTagId => templatesTags.byId(templateTagId).templateId === templateId)
      .map(templateTagId => {
        return tags.byId(templatesTags.byId(templateTagId).tagId)
      });

    return {
      ...template,
      tags: templateTags
    }
  }) as NoteTemplate[]
})
