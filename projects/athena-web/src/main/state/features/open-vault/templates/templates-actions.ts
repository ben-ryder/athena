import {createAction} from "@reduxjs/toolkit";
import {
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {DatabaseTemplate} from "./templates-interface";

export enum TemplatesActions {
  CREATE = "templates/create",
  UPDATE = "templates/update",
  UPDATE_TAGS = "templates/update/tags",
  DELETE = "templates/delete"
}

export const createTemplate = createAction<DatabaseTemplate>(TemplatesActions.CREATE);

export interface UpdateTemplatePayload {
  id: string,
  changes: Partial<DatabaseTemplate>
}
export const updateTemplate = createAction<UpdateTemplatePayload>(TemplatesActions.UPDATE);

export const updateTemplateTags = createAction<UpdateTagsPayload>(TemplatesActions.UPDATE_TAGS);

export const deleteTemplate = createAction<string>(TemplatesActions.DELETE);
