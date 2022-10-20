import {v4 as createUUID} from "uuid";

import {ApplicationState, AppThunkDispatch} from "../../../store";
import {FolderContent} from "./folders-interface";
import {createFolder, updateFolder} from "./folders-actions";
import {FolderMoveValidationResult, validateFolderMove} from "./file-system-helpers";
import {setApplicationError} from "../../ui/errors/errors-actions";


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

export function moveFolder(folderId: string, newParentId: string | null) {
  return (dispatch: AppThunkDispatch, getState: () => ApplicationState) => {
    const state = getState();

    const result = validateFolderMove(state.currentVault.folders, folderId, newParentId);

    if (result === FolderMoveValidationResult.VALID) {
      const timestamp = new Date().toISOString();
      dispatch(updateFolder({
        id: folderId,
        changes: {
          parentId: newParentId,
          updatedAt: timestamp
        }
      }));
    }
    else if (result === FolderMoveValidationResult.ERROR_CHILD_FOLDER) {
      dispatch(setApplicationError({
        heading: "Woah hang on there!",
        text: "You can't move a folder into itself, that would break the universe."
      }));
    }
    else if (result === FolderMoveValidationResult.ERROR_SAME_PARENT) {
      dispatch(setApplicationError({
        heading: "Woah hang on there!",
        text: "You can't move a folder to it's current location."
      }));
    }
    else if (result === FolderMoveValidationResult.ERROR_SELECTED_SELF) {
      dispatch(setApplicationError({
        heading: "Woah hang on there!",
        text: "You can't move a folder into itself."
      }));
    }
  }
}
