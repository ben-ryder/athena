import {createAction} from "@reduxjs/toolkit";
import {NotesActions} from "../../../action-types";
import {
  DeleteActionPayload,
  MoveActionPayload,
  RenameActionPayload,
  UpdateTagsPayload
} from "../../../common/action-interfaces";
import {Note} from "../open-vault-interfaces";

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
