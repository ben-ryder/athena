import {ContentData} from "../content/content-selctors";
import {ContentType} from "../content/content-interface";
import {Tag, Folder, DatabaseNoteTemplate} from "../../database/athena-database";

export interface UIModalsState {
  // Content
  createContent: {
    isOpen: boolean,
    type: ContentType | null,
    targetFolderId: string | null
  },
  renameContent: {
    isOpen: boolean,
    content: ContentData | null
  },
  moveContent: {
    isOpen: boolean,
    content: ContentData | null
  }
  deleteContent: {
    isOpen: boolean,
    content: ContentData | null
  },

  // Note Templates
  noteTemplateFolder: {
    isOpen: boolean,
    noteTemplate: DatabaseNoteTemplate | null
  }

  // Tags
  deleteTag: {
    isOpen: boolean,
    tag: Tag | null
  },

  // Folders
  createFolder: {
    isOpen: boolean,
    targetFolderId: string | null
  },
  renameFolder: {
    isOpen: boolean,
    folder: Folder | null
  },
  moveFolder: {
    isOpen: boolean,
    folder: Folder | null
  },
  deleteFolder: {
    isOpen: boolean,
    folder: Folder | null
  }
}
