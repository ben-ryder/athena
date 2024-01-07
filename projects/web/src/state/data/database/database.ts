import {combineReducers} from "@reduxjs/toolkit";
import {TagsTable} from "./tags/tags";
import { ContentItemsTable } from "./content-items/content-items";
import { contentItemsReducer } from "./content-items/content-items.state";
import { tagsReducer } from "./tags/tags.state";

export interface Database {
  tags: TagsTable
  content: ContentItemsTable
}

export const databaseReducer = combineReducers({
  content: contentItemsReducer,
  tags: tagsReducer,
})
