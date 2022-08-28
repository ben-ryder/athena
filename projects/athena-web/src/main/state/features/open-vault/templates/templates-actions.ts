import {createAction} from "@reduxjs/toolkit";
import {TemplatesActions} from "../../../action-types";
import {
  DeleteActionPayload,
  MoveActionPayload,
  RenameActionPayload,
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {Template} from "../open-vault-interfaces";

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
