import {createAction} from "@reduxjs/toolkit";
import {ContentData} from "../content/content-selctors";
import {ContentType} from "../content/content-interface";
import {Tag} from "../../open-vault/tags/tags-interface";

export enum UIModalsActions {
  // Content
  RENAME_CONTENT_OPEN = "modals/content/rename/open",
  RENAME_CONTENT_CLOSE = "modals/content/rename/close",
  DELETE_CONTENT_OPEN = "modals/content/delete/open",
  DELETE_CONTENT_CLOSE = "modals/content/delete/close",
  CREATE_CONTENT_OPEN = "modals/content/create/open",
  CREATE_CONTENT_CLOSE = "modals/content/create/close",

  // Tags
  DELETE_TAG_OPEN = "modals/tags/delete/open",
  DELETE_TAG_CLOSE = "modals/tags/delete/close",
}

// Content Modals
export const openRenameContentModal = createAction<ContentData>(UIModalsActions.RENAME_CONTENT_OPEN);

export const closeRenameContentModal = createAction(UIModalsActions.RENAME_CONTENT_CLOSE);

export const openDeleteContentModal = createAction<ContentData>(UIModalsActions.DELETE_CONTENT_OPEN);

export const closeDeleteContentModal = createAction(UIModalsActions.DELETE_CONTENT_CLOSE);

export const openCreateContentModal = createAction<ContentType>(UIModalsActions.CREATE_CONTENT_OPEN);

export const closeCreateContentModal = createAction(UIModalsActions.CREATE_CONTENT_CLOSE);

// Tag Modals
export const openDeleteTagModal = createAction<Tag>(UIModalsActions.DELETE_TAG_OPEN);

export const closeDeleteTagModal = createAction(UIModalsActions.DELETE_TAG_CLOSE);
