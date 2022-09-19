import {createReducer} from "@reduxjs/toolkit";
import {createFolder, updateFolder, deleteFolder} from "./folders-actions";
import {FoldersState} from "./folders-interface";
import {foldersAdapter} from "./folders-adapter";

export const initialFolders: FoldersState = {
  entities: {},
  ids: []
};

export const foldersReducer = createReducer(
  initialFolders,
  (builder) => {
    builder.addCase(createFolder, foldersAdapter.addOne)
    builder.addCase(updateFolder, foldersAdapter.updateOne)
    // Delete folder handled by global reducer because of the logic and amount of state changes required
    // in recursively finding and deleting all other folders and content.
    //builder.addCase(deleteFolder, foldersAdapter.removeOne)
  }
);
