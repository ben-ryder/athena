import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { TagEntity } from "./tags";

export const tagsAdapter = createEntityAdapter<TagEntity>({
  selectId: (entity: TagEntity) => entity.id,
  sortComparer: (a, b) => a.updatedAt > b.updatedAt ? 1 : 0
})

export const tagsSlice = createSlice<ContentItemsTable>({
  name: 'contentItems',
  initialState: tagsAdapter.getInitialState(),
  reducers: {
    createTag: tagsAdapter.addOne,
    updateTag: tagsAdapter.updateOne,
    deleteTag: tagsAdapter.removeOne,
    clearTags: tagsAdapter.removeAll,
  }
})

export const {
  createTag: _createTag,
  updateTag: _updateTag,
  deleteTag: _deleteTag,
  clearTags: _clearTags
} = tagsSlice.actions

export const tagsReducer = tagsSlice.reducer
