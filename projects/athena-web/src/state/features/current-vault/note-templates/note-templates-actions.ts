import {createAction} from "@reduxjs/toolkit";
import {
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {DatabaseNoteTemplate} from "./note-templates-interface";

export enum NoteTemplatesActions {
  CREATE = "templates/create",
  UPDATE = "templates/update",
  UPDATE_TAGS = "templates/update/tags",
  DELETE = "templates/delete"
}

export const createNoteTemplate = createAction<DatabaseNoteTemplate>(NoteTemplatesActions.CREATE);

export interface UpdateNoteTemplatePayload {
  id: string,
  changes: Partial<DatabaseNoteTemplate>
}
export const updateNoteTemplate = createAction<UpdateNoteTemplatePayload>(NoteTemplatesActions.UPDATE);

export const updateNoteTemplateTags = createAction<UpdateTagsPayload>(NoteTemplatesActions.UPDATE_TAGS);

export const deleteNoteTemplate = createAction<string>(NoteTemplatesActions.DELETE);
