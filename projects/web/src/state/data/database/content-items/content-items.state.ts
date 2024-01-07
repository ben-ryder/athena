import { createEntityAdapter, createReducer, createSlice } from "@reduxjs/toolkit";

import {ContentItemEntity, ContentItemsTable} from "./content-items";

export const contentItemsAdapter = createEntityAdapter<ContentItemEntity>({
  selectId: (entity: ContentItemEntity) => entity.id,
  sortComparer: (a, b) => a.updatedAt > b.updatedAt ? 1 : 0
})

export const contentItemsSlice = createSlice<ContentItemsTable>({
  name: 'contentItems',
  initialState: contentItemsAdapter.getInitialState(),
  reducers: {
    createContentItem: contentItemsAdapter.addOne,
    updateContentItem: contentItemsAdapter.updateOne,
    deleteContentItem: contentItemsAdapter.removeOne,
    clearContentItems: contentItemsAdapter.removeAll,
  }
})

export const {
  createContentItem: _createContentItem,
  updateContentItem: _updateContentItem,
  deleteContentItem: _deleteContentItem,
  clearContentItems: _clearContentItems
} = contentItemsSlice.actions

export const contentItemsReducer = contentItemsSlice.reducer
