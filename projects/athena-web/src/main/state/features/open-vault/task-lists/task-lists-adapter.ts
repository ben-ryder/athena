import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseTaskList} from "./task-lists-interface";

export const taskListsAdapter = createEntityAdapter<DatabaseTaskList>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
