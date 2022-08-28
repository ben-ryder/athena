import {createAction} from "@reduxjs/toolkit";
import {
  DeleteActionPayload,
  MoveActionPayload,
  RenameActionPayload,
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {Note} from "../open-vault-interfaces";

export enum NotesActions {
  CREATE = "notes/create",
  RENAME = "notes/update/rename",
  UPDATE_BODY = "notes/update/body",
  UPDATE_TAGS = "notes/update/tags",
  MOVE = "notes/update/move",
  DELETE = "notes/delete"
}

export const createNote = createAction<Note>(NotesActions.CREATE);

export const renameNote = createAction<RenameActionPayload>(NotesActions.RENAME);

export const moveNote = createAction<MoveActionPayload>(NotesActions.MOVE);

export interface UpdateBodyActionPayload {
  id: string,
  body: string
}
export const updateNoteBody = createAction<UpdateBodyActionPayload>(NotesActions.UPDATE_BODY);

export const updateNoteTags = createAction<UpdateTagsPayload>(NotesActions.UPDATE_TAGS);

export const deleteNote = createAction<DeleteActionPayload>(NotesActions.DELETE);
