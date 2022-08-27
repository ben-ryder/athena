import {createReducer} from "@reduxjs/toolkit";
import {TagsState} from "../open-vault-interfaces";

export const initialTags: TagsState = {
  entities: {},
  ids: []
};

export const tagsReducer = createReducer(
  initialTags,
  (builder) => {}
);
