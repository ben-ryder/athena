import {v4 as createUUID} from "uuid";

import {AppThunk} from "../../../store";
import {FolderContent} from "../document-interface";
import {FolderMoveValidationResult, validateFolderMove} from "./file-system-helpers";
import {setApplicationError} from "../../ui/errors/errors-actions";
import {updateDocument} from "../document-reducer";
import {createFolderChange, updateFolderChange} from "./folders-changes";


export function createNewFolder(folderContent: FolderContent): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const folderID = createUUID();
    const timestamp = new Date().toISOString();

    const folder = {
      id: folderID,
      name: folderContent.name,
      parentId: folderContent.parentId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    let updatedDoc = createFolderChange(state.document, folder);
    dispatch(updateDocument(updatedDoc));
  }
}

export function renameFolder(folderId: string, newName: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();

    let updatedDoc = updateFolderChange(state.document, folderId, {updatedAt: timestamp, name: newName});
    dispatch(updateDocument(updatedDoc));
  }
}

export function moveFolder(folderId: string, newParentId: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const result = validateFolderMove(state.document.folders, folderId, newParentId);

    if (result === FolderMoveValidationResult.VALID) {
      const timestamp = new Date().toISOString();
      let updatedDoc = updateFolderChange(state.document, folderId, {updatedAt: timestamp, parentId: newParentId});
      dispatch(updateDocument(updatedDoc));
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
