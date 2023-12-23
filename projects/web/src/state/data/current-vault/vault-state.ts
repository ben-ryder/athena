import {combineReducers} from "@reduxjs/toolkit";
import {itemsReducer} from "./items/items-reducer";
import {TagsTable} from "./tags/tags";
import {ItemsTable} from "./items/items";
import {ViewsTable} from "./views/views";
import {VaultSettings} from "./settings/settings";

export enum ContentTypes {
  ITEMS = "items",
  TAGS = "tags",
  VIEWS = "views"
}

export interface VaultDatabase {
  tags: TagsTable
  items: ItemsTable
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
