import {createAction} from "@reduxjs/toolkit";
import {
  DeleteActionPayload,
  MoveActionPayload,
  RenameActionPayload,
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {Template} from "../open-vault-interfaces";

export enum TemplatesActions {
  CREATE = "templates/create",
  RENAME = "templates/update/rename",
  UPDATE_BODY = "templates/update/body",
  UPDATE_TAGS = "templates/update/tags",
  MOVE = "templates/update/move",
  UPDATE_TARGET = "templates/update/target",
  DELETE = "templates/delete"
}

export const createTemplate = createAction<Template>(TemplatesActions.CREATE);

export const renameTemplate = createAction<RenameActionPayload>(TemplatesActions.RENAME);

export const moveTemplate = createAction<MoveActionPayload>(TemplatesActions.MOVE);

export interface UpdateBodyActionPayload {
  id: string,
  body: string
}
export const updateTemplateBody = createAction<UpdateBodyActionPayload>(TemplatesActions.UPDATE_BODY);

export const updateTemplateTags = createAction<UpdateTagsPayload>(TemplatesActions.UPDATE_TAGS);

export const deleteTemplate = createAction<DeleteActionPayload>(TemplatesActions.DELETE);
