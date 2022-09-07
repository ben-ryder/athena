import {createReducer} from "@reduxjs/toolkit";
import {Tag, TagsState} from "../open-vault-interfaces";
import {tagsAdapter} from "./tags-adapter";
import {createTag, deleteTag, updateTag} from "./tags-actions";

export const initialTags: TagsState = {
  entities: {},
  ids: []
};

export const tagsReducer = createReducer(
  initialTags,
  (builder) => {
    builder.addCase(createTag, tagsAdapter.addOne)

    builder.addCase(updateTag, (state, action) => {
      tagsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload
      })
    })

    builder.addCase(deleteTag, (state, action) => {
      tagsAdapter.removeOne(state, action.payload.id)
    })
  }
);
