import {createAction} from "@reduxjs/toolkit";
import {
  UpdateTagsPayload
} from "../../../common/action-interfaces";;
import {DatabaseNote} from "./notes-interface";

export enum NotesActions {
  CREATE = "notes/create",
  UPDATE = "notes/update",
  UPDATE_TAGS = "notes/update/tags",
  DELETE = "notes/delete"
}

export const createNote = createAction<DatabaseNote>(NotesActions.CREATE);

export interface UpdateNotePayload {
  id: string,
  changes: Partial<DatabaseNote>
}
export const updateNote = createAction<UpdateNotePayload>(NotesActions.UPDATE);

export const updateNoteTags = createAction<UpdateTagsPayload>(NotesActions.UPDATE_TAGS);

export const deleteNote = createAction<string>(NotesActions.DELETE);
