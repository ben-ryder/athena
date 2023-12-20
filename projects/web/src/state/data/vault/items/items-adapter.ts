import {createEntityAdapter} from "@reduxjs/toolkit";
import { ItemEntity } from "../items/items";

export const itemsAdapter = createEntityAdapter<ItemEntity>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.updatedAt > b.updatedAt ? 1 : 0
})
