import {createAction} from "@reduxjs/toolkit";
import {
  DeleteActionPayload
} from "../../../common/action-interfaces";
import {Tag} from "../open-vault-interfaces";

export enum TagsActions {
  CREATE = "tags/create",
  UPDATE = "tags/update",
  DELETE = "tags/delete"
}

export const createTag = createAction<Tag>(TagsActions.CREATE);

export const updateTag = createAction<Tag>(TagsActions.UPDATE);

export const deleteTag = createAction<DeleteActionPayload>(TagsActions.DELETE);
