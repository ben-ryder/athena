import {createReducer} from "@reduxjs/toolkit";
import {TemplatesState} from "../open-vault-interfaces";
import {createTemplate, deleteTemplate, moveTemplate, renameTemplate, updateTemplateBody} from "./templates-actions";
import {templatesAdapter} from "./templates-adapter";

export const initialTemplates: TemplatesState = {
  entities: {},
  ids: []
};

export const templatesReducer = createReducer(
  initialTemplates,
  (builder) => {
    builder.addCase(createTemplate, templatesAdapter.addOne)

    builder.addCase(renameTemplate, (state, action) => {
      templatesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          name: action.payload.name
        }
      })
    })

    builder.addCase(moveTemplate, (state, action) => {
      templatesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          folderId: action.payload.folderId
        }
      })
    })

    builder.addCase(updateTemplateBody, (state, action) => {
      templatesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          body: action.payload.body
        }
      })
    })

    builder.addCase(deleteTemplate, (state, action) => {
      templatesAdapter.removeOne(state, action.payload.id)
    })
  }
);
