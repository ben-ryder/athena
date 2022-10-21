import {createAction} from "@reduxjs/toolkit";
import {ContentData} from "../content/content-selctors";
import {ContentType} from "../content/content-interface";
import {DatabaseNoteTemplate, Folder, Tag} from "../../document/document-interface";


export enum UIModalsActions {
  // Content
  CREATE_CONTENT_OPEN = "modals/content/create/open",
  CREATE_CONTENT_CLOSE = "modals/content/create/close",
  RENAME_CONTENT_OPEN = "modals/content/rename/open",
  RENAME_CONTENT_CLOSE = "modals/content/rename/close",
  MOVE_CONTENT_OPEN = "modals/content/move/open",
  MOVE_CONTENT_CLOSE = "modals/content/move/close",
  DELETE_CONTENT_OPEN = "modals/content/delete/open",
  DELETE_CONTENT_CLOSE = "modals/content/delete/close",

  // Note Template
  NOTE_TEMPLATE_FOLDER_OPEN = "modals/note-template-folder/open",
  NOTE_TEMPLATE_FOLDER_CLOSE = "modals/note-template-folder/close",

  // Tags
  DELETE_TAG_OPEN = "modals/tags/delete/open",
  DELETE_TAG_CLOSE = "modals/tags/delete/close",

  // Folders
  CREATE_FOLDER_OPEN = "modals/folder/create/open",
  CREATE_FOLDER_CLOSE = "modals/folder/create/close",
  RENAME_FOLDER_OPEN = "modals/folder/rename/open",
  RENAME_FOLDER_CLOSE = "modals/folder/rename/close",
  MOVE_FOLDER_OPEN = "modals/folder/move/open",
  MOVE_FOLDER_CLOSE = "modals/folder/move/close",
  DELETE_FOLDER_OPEN = "modals/folder/delete/open",
  DELETE_FOLDER_CLOSE = "modals/folder/delete/close",
}

// Content Modals
export interface CreateContentModalData {
  contentType: ContentType,
  targetFolderId: string | null
}
export const openCreateContentModal = createAction<CreateContentModalData>(UIModalsActions.CREATE_CONTENT_OPEN);

export const closeCreateContentModal = createAction(UIModalsActions.CREATE_CONTENT_CLOSE);

export const openRenameContentModal = createAction<ContentData>(UIModalsActions.RENAME_CONTENT_OPEN);

export const closeRenameContentModal = createAction(UIModalsActions.RENAME_CONTENT_CLOSE);

export const openMoveContentModal = createAction<ContentData>(UIModalsActions.MOVE_CONTENT_OPEN);

export const closeMoveContentModal = createAction(UIModalsActions.MOVE_CONTENT_CLOSE);

export const openDeleteContentModal = createAction<ContentData>(UIModalsActions.DELETE_CONTENT_OPEN);

export const closeDeleteContentModal = createAction(UIModalsActions.DELETE_CONTENT_CLOSE);

// Note Templates
export const openNoteTemplateFolderModal = createAction<DatabaseNoteTemplate>(UIModalsActions.NOTE_TEMPLATE_FOLDER_OPEN);

export const closeNoteTemplateFolderModal = createAction(UIModalsActions.NOTE_TEMPLATE_FOLDER_CLOSE);

// Tag Modals
export const openDeleteTagModal = createAction<Tag>(UIModalsActions.DELETE_TAG_OPEN);

export const closeDeleteTagModal = createAction(UIModalsActions.DELETE_TAG_CLOSE);

// Folder Modals
export const openCreateFolderModal = createAction<string|null>(UIModalsActions.CREATE_FOLDER_OPEN);

export const closeCreateFolderModal = createAction(UIModalsActions.CREATE_FOLDER_CLOSE);

export const openRenameFolderModal = createAction<Folder>(UIModalsActions.RENAME_FOLDER_OPEN);

export const closeRenameFolderModal = createAction(UIModalsActions.RENAME_FOLDER_CLOSE);

export const openMoveFolderModal = createAction<Folder>(UIModalsActions.MOVE_FOLDER_OPEN);

export const closeMoveFolderModal = createAction(UIModalsActions.MOVE_FOLDER_CLOSE);

export const openDeleteFolderModal = createAction<Folder>(UIModalsActions.DELETE_FOLDER_OPEN);

export const closeDeleteFolderModal = createAction(UIModalsActions.DELETE_FOLDER_CLOSE);
