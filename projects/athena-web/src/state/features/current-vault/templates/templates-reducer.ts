import {createReducer} from "@reduxjs/toolkit";
import {createTemplate, deleteTemplate,updateTemplate} from "./templates-actions";
import {templatesAdapter} from "./templates-adapter";
import {TemplatesState} from "./templates-interface";

export const initialTemplates: TemplatesState = {
  entities: {},
  ids: []
};

export const templatesReducer = createReducer(
  initialTemplates,
  (builder) => {
    builder.addCase(createTemplate, templatesAdapter.addOne)
    builder.addCase(updateTemplate, templatesAdapter.updateOne);
    builder.addCase(deleteTemplate, templatesAdapter.removeOne);
  }
);
