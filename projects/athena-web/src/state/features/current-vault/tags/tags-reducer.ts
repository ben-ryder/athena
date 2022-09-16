import {createReducer} from "@reduxjs/toolkit";
import {tagsAdapter} from "./tags-adapter";
import {createTag, deleteTag, updateTag} from "./tags-actions";
import {TagsState} from "./tags-interface";

export const initialTags: TagsState = {
  entities: {},
  ids: []
};

export const tagsReducer = createReducer(
  initialTags,
  (builder) => {
    builder.addCase(createTag, tagsAdapter.addOne)
    builder.addCase(updateTag, tagsAdapter.updateOne)
    builder.addCase(deleteTag, tagsAdapter.removeOne)
  }
);
