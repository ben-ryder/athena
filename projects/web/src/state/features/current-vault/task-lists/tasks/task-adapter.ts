import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseTask} from "./task-interface";

export const taskAdapter = createEntityAdapter<DatabaseTask>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
