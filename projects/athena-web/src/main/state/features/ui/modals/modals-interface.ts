import {ContentData} from "../content/content-selctors";


export interface UIModalsState {
  renameContent: {
    isOpen: boolean,
    content: ContentData | null
  }
}