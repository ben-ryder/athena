import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseFolder} from "./folders-interface";

export const foldersAdapter = createEntityAdapter<DatabaseFolder>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
