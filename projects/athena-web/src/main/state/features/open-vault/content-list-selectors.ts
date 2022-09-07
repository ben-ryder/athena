import {createSelector} from "@reduxjs/toolkit";
import {ContentType} from "../ui/content/content-interface";
import {selectNotesState} from "./notes/notes-selectors";
import {selectTemplatesState} from "./templates/templates-selectors";
import {ContentData} from "../ui/content/content-selctors";
import {selectTaskListsState} from "./task-lists/task-lists-selectors";
import {selectContentListPage, selectContentListFilters} from "../ui/view/view-selectors";
import {OrderBy, OrderDirection} from "./open-vault-interfaces";
import {ListingMetadata} from "../../common/listing-metadata";

export const contentListPageSize = 12;

export interface ContentListData {
  meta: ListingMetadata,
  list: ContentData[]
}

export const selectContentList = createSelector([selectContentListPage, selectContentListFilters, selectNotesState, selectTemplatesState, selectTaskListsState], (page, filters, notes, templates, taskLists) => {
  const noteContent: ContentData[] = notes.ids.map(noteId => {
    return {
      type: ContentType.NOTE,
      data: notes.entities[noteId],
    }
  })

  const templateContent: ContentData[] = templates.ids.map(templateId => {
    return {
      type: ContentType.TEMPLATE,
      data: templates.entities[templateId],
    }
  })

  const taskListContent: ContentData[] = taskLists.ids.map(taskListId => {
    return {
      type: ContentType.TASK_LIST,
      data: taskLists.entities[taskListId],
    }
  })

  let allContent = noteContent
    .concat(templateContent)
    .concat(taskListContent)

  allContent = allContent.filter(content => {
    if (!content.data.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (!filters.contentTypes.includes(content.type)) {
      return false;
    }

    // todo: add tags filter

    return true;
  })

  if (filters.orderBy === OrderBy.NAME) {
    if (filters.orderDirection === OrderDirection.ASC) {
      allContent = allContent.sort((a, b) => a.data.name.localeCompare(b.data.name));
    }
    else {
      allContent = allContent.sort((a, b) => b.data.name.localeCompare(a.data.name));
    }
  }
  else if (filters.orderBy === OrderBy.UPDATED_AT) {
    if (filters.orderDirection === OrderDirection.ASC) {
      allContent = allContent.sort((a, b) => {
        return a.data.updatedAt > b.data.updatedAt ? 1 : -1;
      })
    }
    else {
      allContent = allContent.sort((a, b) => {
        return a.data.updatedAt > b.data.updatedAt ? -1 : 1;
      })
    }
  }
  else {
    if (filters.orderDirection === OrderDirection.ASC) {
      allContent = allContent.sort((a, b) => {
        return a.data.createdAt > b.data.createdAt ? 1 : -1;
      })
    }
    else {
      allContent = allContent.sort((a, b) => {
        return a.data.createdAt > b.data.createdAt ? -1 : 1;
      })
    }
  }

  const contentListPage = allContent
    .slice(contentListPageSize * (page - 1), contentListPageSize * (page - 1) + contentListPageSize);

  const meta: ListingMetadata = {
    total: allContent.length,
    pageSize: contentListPageSize,
    currentPage: page
  }

  return {
    meta: meta,
    list: contentListPage
  } as ContentListData
})
