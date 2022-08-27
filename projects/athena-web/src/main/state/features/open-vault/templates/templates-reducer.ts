import {createReducer} from "@reduxjs/toolkit";
import {TemplatesState} from "../open-vault-interfaces";

export const initialTemplates: TemplatesState = {
  entities: {},
  ids: []
};

export const templatesReducer = createReducer(
  initialTemplates,
  (builder) => {}
);
