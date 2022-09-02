import {createEntityAdapter} from "@reduxjs/toolkit";
import {TaskList} from "../open-vault-interfaces";


export const taskListsAdapter = createEntityAdapter<TaskList>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
