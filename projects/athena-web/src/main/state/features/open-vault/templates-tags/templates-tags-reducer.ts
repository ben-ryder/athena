import {createReducer} from "@reduxjs/toolkit";
import {TemplatesTagsState} from "../open-vault-interfaces";

export const initialTemplatesTags: TemplatesTagsState = {
  entities: {},
  ids: []
};

export const templatesTagsReducer = createReducer(
  initialTemplatesTags,
  (builder) => {}
);
