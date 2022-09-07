import {createEntityAdapter} from "@reduxjs/toolkit";
import {Tag} from "../open-vault-interfaces";


export const tagsAdapter = createEntityAdapter<Tag>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
