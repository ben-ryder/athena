import {createAction} from "@reduxjs/toolkit";
import {ContentData} from "../content/content-selctors";
import {ContentType} from "../content/content-interface";

export enum UIModalsActions {
  RENAME_OPEN = "modals/rename/open",
  RENAME_CLOSE = "modals/rename/close",
  DELETE_OPEN = "modals/delete/open",
  DELETE_CLOSE = "modals/delete/close",
  CREATE_OPEN = "modals/create/open",
  CREATE_CLOSE = "modals/create/close"
}

export const openRenameModal = createAction<ContentData>(UIModalsActions.RENAME_OPEN);

export const closeRenameModal = createAction(UIModalsActions.RENAME_CLOSE);

export const openDeleteModal = createAction<ContentData>(UIModalsActions.DELETE_OPEN);

export const closeDeleteModal = createAction(UIModalsActions.DELETE_CLOSE);

export const openCreateModal = createAction<ContentType>(UIModalsActions.CREATE_OPEN);

export const closeCreateModal = createAction(UIModalsActions.CREATE_CLOSE);
