import {createReducer} from "@reduxjs/toolkit";

import {_createItemAction, _updateItemAction, _deleteItemAction} from "./items-actions";
import {itemsAdapter} from "./items-adapter";
import { ItemsTable } from "../items/items";

export const initialItems: ItemsTable = {
  entities: {},
  ids: []
};

export const itemsReducer = createReducer(
  initialItems,
  (builder) => {
    builder.addCase(_createItemAction, itemsAdapter.addOne);
    builder.addCase(_updateItemAction, itemsAdapter.updateOne);
    builder.addCase(_deleteItemAction, itemsAdapter.removeOne);
  }
);
