import {ContentData} from "../../ui/content/content-selctors";
import {Folder} from "./folders-interface";

export interface FileSystemTree {
  folders: FileSystemFolder[],
  files: ContentData[]
}

export interface FileSystemFolder {
  details: Folder,
  files: ContentData[],
  folders: FileSystemFolder[]
}

export interface FolderTree {
  details: Folder,
  folders: FolderTree[]
}