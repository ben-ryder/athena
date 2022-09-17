import {v4 as createUUID} from "uuid";

import {ApplicationState, AppThunkDispatch} from "../../../store";
import {FolderContent} from "./folders-interface";
import {createFolder, updateFolder} from "./folders-actions";
import {validateFolderMove} from "./file-system-helpers";


export function createNewFolder(folderContent: FolderContent) {
  return (dispatch: AppThunkDispatch) => {
    const folderID = createUUID();
    const timestamp = new Date().toISOString();

    const folder = {
      id: folderID,
      name: folderContent.name,
      parentId: folderContent.parentId,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(createFolder(folder))
  }
}

export function renameFolder(folderId: string, newName: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateFolder({
      id: folderId,
      changes: {
        name: newName,
        updatedAt: timestamp
      }
    }));
  }
}


export function moveFolder(folderId: string, newParentId: string) {
  return (dispatch: AppThunkDispatch, state: ApplicationState) => {
    const valid = validateFolderMove(state.currentVault.folders, folderId, newParentId);
    if (!valid) {
      state.ui.errors.applicationError = "You can't move a folder into itself, that would break the universe!"
    }

    const timestamp = new Date().toISOString();
    dispatch(updateFolder({
      id: folderId,
      changes: {
        parentId: newParentId,
        updatedAt: timestamp
      }
    }));
  }
}
