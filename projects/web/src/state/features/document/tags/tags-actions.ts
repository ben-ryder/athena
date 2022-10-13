import {createAction} from "@reduxjs/toolkit";
import {DatabaseTag, Tag} from "../document-interface";

export enum TagsActions {
  CREATE = "tags/create",
  UPDATE = "tags/update",
  DELETE = "tags/delete"
}

export const createTag = createAction<Tag>(TagsActions.CREATE);

export interface UpdateTagPayload {
  id: string,
  changes: Partial<DatabaseTag>
}
export const updateTag = createAction<UpdateTagPayload>(TagsActions.UPDATE);

export const deleteTag = createAction<string>(TagsActions.DELETE);
