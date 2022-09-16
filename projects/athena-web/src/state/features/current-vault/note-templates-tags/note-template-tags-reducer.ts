import {createReducer} from "@reduxjs/toolkit";
import {v4 as createUUID} from "uuid";
import {updateNoteTemplateTags} from "../note-templates/note-templates-actions";
import {NoteTemplatesTagsState} from "./note-template-tags-interface";

export const initialNoteTemplatesTags: NoteTemplatesTagsState = {
  entities: {},
  ids: []
};

export const noteTemplateTagsReducer = createReducer(
  initialNoteTemplatesTags,
  (builder) => {
    builder.addCase(updateNoteTemplateTags, (state, action) => {
      const existingTags = state.ids.filter(templateTagId => {
        return state.entities[templateTagId].templateId === action.payload.id
      });

      // Remove existing tags
      state.ids = state.ids.filter(templateTagId => !existingTags.includes(templateTagId));
      for (const templateTagId of existingTags) {
        delete state.entities[templateTagId];
      }

      // Add new tags
      for (const tagId of action.payload.tags) {
        const id = createUUID();
        state.ids.push(id);
        state.entities[id] = {
          id: id,
          templateId: action.payload.id,
          tagId: tagId
        }
      }
    })
  }
);
