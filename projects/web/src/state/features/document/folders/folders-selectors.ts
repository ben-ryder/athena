import {ContentData} from "../../ui/content/content-selctors";
import {Folder} from "../document-interface";
import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../store";
import {getChildFileSystemFolders, getChildFolderTrees, getFolderFiles} from "./file-system-helpers";
import {selectNotesState} from "../notes/notes-selectors";
import {selectNoteTemplatesState} from "../note-templates/note-templates-selectors";
import {selectTaskListsState} from "../task-lists/task-lists-selectors";

export interface FileSystemTree {
  folders: FileSystemFolder[],
  files: ContentData[]
}

export interface FileSystemFolder {
  details: Folder,
  folders: FileSystemFolder[],
  files: ContentData[]
}

export interface FolderTree {
  folders: FolderTreeItem[]
}

export interface FolderTreeItem {
  details: Folder,
  folders: FolderTreeItem[]
}

export const selectFoldersState = (state: ApplicationState) => state.currentVault.folders;

export const selectFolderTree = createSelector([selectFoldersState], (foldersState) => {
  const folderTree: FolderTree = {
    folders: getChildFolderTrees(foldersState, null)
  }

  return folderTree;
})

export const selectFileSystemTree = createSelector([
  selectFoldersState,
  selectNotesState, selectNoteTemplatesState, selectTaskListsState
], (foldersState, notesState, noteTemplatesState, taskListsState) => {
  const fileSystemTree: FileSystemTree = {
    folders: getChildFileSystemFolders(null, foldersState, notesState, noteTemplatesState, taskListsState),
    files: getFolderFiles(null, notesState, noteTemplatesState, taskListsState)
  }

  return fileSystemTree;
})
