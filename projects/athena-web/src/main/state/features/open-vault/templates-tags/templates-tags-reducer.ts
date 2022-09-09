import {createReducer} from "@reduxjs/toolkit";
import {TemplatesTagsState} from "../open-vault-interfaces";
import {v4 as createUUID} from "uuid";
import {updateTemplateTags} from "../templates/templates-actions";

export const initialTemplatesTags: TemplatesTagsState = {
  entities: {},
  ids: []
};

export const templatesTagsReducer = createReducer(
  initialTemplatesTags,
  (builder) => {
    builder.addCase(updateTemplateTags, (state, action) => {
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
