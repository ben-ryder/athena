import {createEntityAdapter, createReducer} from "@reduxjs/toolkit";

import {_createItemAction, _updateItemAction, _deleteItemAction, _deleteAllItems} from "./items-actions";
import {ItemEntity, ItemsTable} from "./items";

export const initialItems: ItemsTable = {
  entities: {},
  ids: []
};

export const itemsAdapter = createEntityAdapter({
  selectId: (entity: ItemEntity) => entity.id,
  sortComparer: (a, b) => a.updatedAt > b.updatedAt ? 1 : 0
})

export const itemsReducer = createReducer(
  initialItems,
  (builder) => {
    builder.addCase(_createItemAction, itemsAdapter.addOne);
    builder.addCase(_updateItemAction, itemsAdapter.updateOne);
    builder.addCase(_deleteItemAction, itemsAdapter.removeOne);
    builder.addCase(_deleteAllItems, itemsAdapter.removeAll);
  }
);
