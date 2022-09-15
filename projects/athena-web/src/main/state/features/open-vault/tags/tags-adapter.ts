import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseTag} from "./tags-interface";

export const tagsAdapter = createEntityAdapter<DatabaseTag>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
