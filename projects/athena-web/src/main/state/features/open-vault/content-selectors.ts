import {createSelector} from "@reduxjs/toolkit";
import {ContentType} from "../ui/content/content-interface";
import {selectNotesState} from "./notes/notes-selectors";
import {selectTemplatesState} from "./templates/templates-selectors";
import {ContentData} from "../ui/content/content-selctors";
import {selectTaskListsState} from "./task-lists/task-lists-selectors";
import {selectCurrentPage, selectListFilters} from "../ui/view/view-selectors";

export const pageSize = 12;

export interface ListingMetadata {
  currentPage: number,
  pageSize: number,
  total: number
}

export interface ContentListData {
  meta: ListingMetadata,
  list: ContentData[]
}

export const selectContentList = createSelector([selectCurrentPage, selectListFilters, selectNotesState, selectTemplatesState, selectTaskListsState], (page, filters, notes, templates, taskLists) => {
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

  const allContent = noteContent
    .concat(templateContent)
    .concat(taskListContent)
    // todo: in future other state will determine specific sort field, pagination etc
    .sort((a, b) => a.data.name.localeCompare(b.data.name));

  const contentListPage = allContent
    .slice(pageSize * (page - 1), pageSize * (page - 1) + pageSize);

  const meta: ListingMetadata = {
    total: allContent.length,
    pageSize: pageSize,
    currentPage: page
  }

  return {
    meta: meta,
    list: contentListPage
  } as ContentListData
})
