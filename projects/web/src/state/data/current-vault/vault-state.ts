import {combineReducers} from "@reduxjs/toolkit";
import {itemsReducer} from "./items/items-reducer";
import {TagsTable} from "./tags/tags";
import {ItemsTable} from "./items/items";
import {ViewsTable} from "./views/views";
import {VaultSettings} from "./settings/settings";
import { CustomFieldsTable } from "./custom-fields/custom-fields";

export interface VaultDatabase {
  tags: TagsTable
  items: ItemsTable
  fields: CustomFieldsTable
  views: ViewsTable
  settings: VaultSettings
}

export interface VaultState {
  id: string | null,
  db: VaultDatabase
}

export const currentVaultReducer = combineReducers({
  items: itemsReducer
})
