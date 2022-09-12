import {createEntityAdapter} from "@reduxjs/toolkit";
import {DatabaseTemplate} from "./templates-interface";

export const templatesAdapter = createEntityAdapter<DatabaseTemplate>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
