import {createSelector} from "@reduxjs/toolkit";
import {selectTagsState} from "./tags/tags-selectors";
import {selectTagsListFilters, selectTagsListPage} from "../ui/view/view-selectors";
import {ListingMetadata} from "../../common/listing-metadata";
import {Tag} from "./tags/tags-interface";
import {OrderBy} from "../../common/order-by-enum";
import {OrderDirection} from "../../common/order-direction-enum";

export const tagsListPageSize = 20;

export interface TagsListData {
  meta: ListingMetadata,
  list: Tag[]
}

export const selectTagsList = createSelector([selectTagsState, selectTagsListPage, selectTagsListFilters],(tags, currentPage, filters) => {
  let tagList = tags.ids.map(tagId => tags.entities[tagId]);

  tagList = tagList.filter(tag => {
    return tag.name.toLowerCase().includes(filters.search.toLowerCase());
  })

  if (filters.orderBy === OrderBy.NAME) {
    if (filters.orderDirection === OrderDirection.ASC) {
      tagList = tagList.sort((a, b) => a.name.localeCompare(b.name));
    }
    else {
      tagList = tagList.sort((a, b) => b.name.localeCompare(a.name));
    }
  }
  else if (filters.orderBy === OrderBy.UPDATED_AT) {
    if (filters.orderDirection === OrderDirection.ASC) {
      tagList = tagList.sort((a, b) => {
        return a.updatedAt > b.updatedAt ? 1 : -1;
      })
    }
    else {
      tagList = tagList.sort((a, b) => {
        return a.updatedAt > b.updatedAt ? -1 : 1;
      })
    }
  }
  else {
    if (filters.orderDirection === OrderDirection.ASC) {
      tagList = tagList.sort((a, b) => {
        return a.createdAt > b.createdAt ? 1 : -1;
      })
    }
    else {
      tagList = tagList.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      })
    }
  }

  const pagedTagList = tagList
    .slice(tagsListPageSize * (currentPage - 1), tagsListPageSize * (currentPage - 1) + tagsListPageSize);

  const meta: ListingMetadata = {
    total: tagList.length,
    pageSize: tagsListPageSize,
    currentPage: currentPage
  }

  return {
    meta,
    list: pagedTagList
  } as TagsListData
})
