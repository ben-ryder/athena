import {createAction} from "@reduxjs/toolkit";
import {DatabaseFolder} from "./folders-interface";

export enum FoldersActions {
  CREATE = "folders/create",
  UPDATE = "folders/update",
  DELETE = "folders/delete"
}

export const createFolder = createAction<DatabaseFolder>(FoldersActions.CREATE);

export interface UpdateFolderPayload {
  id: string,
  changes: Partial<DatabaseFolder>
}
export const updateFolder = createAction<UpdateFolderPayload>(FoldersActions.UPDATE);

export const deleteFolder = createAction<string>(FoldersActions.DELETE);
