import {createAction} from "@reduxjs/toolkit";
import {ContentListFilters, TagsListFilters, ViewModes} from "./view-interface";

export enum UIViewActions {
  SWITCH_VIEW_MODE = "viewMode/switch",
  CONTENT_LIST_UPDATE_FILTERS = "contentList/filters/update",
  CONTENT_LIST_RESET_FILTERS = "contentList/filters/reset",
  CONTENT_LIST_INCREMENT = "contentList/increment",
  CONTENT_LIST_DECREMENT = "contentList/decrement",
  TAGS_LIST_UPDATE_FILTERS = "tagsList/filters/update",
  TAGS_LIST_RESET_FILTERS = "tagsList/filters/reset",
  TAGS_INCREMENT = "tagsList/increment",
  TAGS_DECREMENT = "tagsList/decrement"
}

export const switchCurrentViewMode = createAction<ViewModes>(UIViewActions.SWITCH_VIEW_MODE);

// Content List
export const updateContentListFilters = createAction<ContentListFilters>(UIViewActions.CONTENT_LIST_UPDATE_FILTERS);

export const resetContentListFilters = createAction(UIViewActions.CONTENT_LIST_RESET_FILTERS);

export const incrementContentList = createAction(UIViewActions.CONTENT_LIST_INCREMENT);

export const decrementContentList = createAction(UIViewActions.CONTENT_LIST_DECREMENT);

// Tags List
export const updateTagsListFilters = createAction<TagsListFilters>(UIViewActions.TAGS_LIST_UPDATE_FILTERS);

export const resetTagsListFilters = createAction(UIViewActions.TAGS_LIST_RESET_FILTERS);

export const incrementTagsList = createAction(UIViewActions.TAGS_INCREMENT);

export const decrementTagsList = createAction(UIViewActions.TAGS_DECREMENT);
