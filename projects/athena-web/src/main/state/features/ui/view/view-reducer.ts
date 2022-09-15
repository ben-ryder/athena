import {createReducer} from "@reduxjs/toolkit";
import {
  decrementContentList,
  decrementTagsList, incrementContentList,
  incrementTagsList, resetContentListFilters, resetTagsListFilters,
  switchCurrentViewMode, updateContentListFilters, updateTagsListFilters,
} from "./view-actions";
import {ContentListFilters, TagsListFilters, UIViewState, ViewModes} from "./view-interface";
import {ContentType} from "../content/content-interface";
import {OrderBy, OrderDirection} from "../../open-vault/open-vault-interfaces";

export const defaultContentListFilters: ContentListFilters = {
  search: "",
  contentTypes: [ContentType.NOTE, ContentType.TASK_LIST],
  orderBy: OrderBy.NAME,
  orderDirection: OrderDirection.ASC,
  tags: []
}

export const defaultTagsListFilters: TagsListFilters = {
  search: "",
  orderBy: OrderBy.NAME,
  orderDirection: OrderDirection.ASC
}


export const initialUIViewState: UIViewState = {
  currentViewMode: ViewModes.FOLDER_VIEW,
  contentList: {
    filters: defaultContentListFilters,
    currentPage: 1
  },
  tagsList: {
    filters: defaultTagsListFilters,
    currentPage: 1
  }
};

export const uiViewReducer = createReducer(
  initialUIViewState,
  (builder) => {
    builder.addCase(switchCurrentViewMode, (state, action) => {
      state.currentViewMode = action.payload;
    })

    // Content List
    builder.addCase(updateContentListFilters, (state, action) => {
      state.contentList.filters = action.payload;
      state.contentList.currentPage = 1;
    })

    builder.addCase(resetContentListFilters, (state, action) => {
      state.contentList.filters = defaultContentListFilters;
      state.contentList.currentPage = 1;
    })

    builder.addCase(incrementContentList, (state) => {
      state.contentList.currentPage++;
    })

    builder.addCase(decrementContentList, (state) => {
      if (state.contentList.currentPage > 1) {
        state.contentList.currentPage--;
      }
    })

    // Tags List
    builder.addCase(updateTagsListFilters, (state, action) => {
      state.tagsList.filters = action.payload;
      state.tagsList.currentPage = 1;
    })

    builder.addCase(resetTagsListFilters, (state, action) => {
      state.tagsList.filters = defaultTagsListFilters;
      state.tagsList.currentPage = 1;
    })

    builder.addCase(incrementTagsList, (state) => {
      state.tagsList.currentPage++;
    })

    builder.addCase(decrementTagsList, (state) => {
      if (state.tagsList.currentPage > 1) {
        state.tagsList.currentPage--;
      }
    })
  }
);
