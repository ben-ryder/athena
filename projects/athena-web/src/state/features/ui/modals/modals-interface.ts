import {ContentData} from "../content/content-selctors";
import {ContentType} from "../content/content-interface";
import {Tag} from "../../current-vault/tags/tags-interface";

export interface UIModalsState {
  // Content
  createContent: {
    isOpen: boolean,
    type: ContentType | null
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

  // Tags
  deleteTag: {
    isOpen: boolean,
    tag: Tag | null
  }
}