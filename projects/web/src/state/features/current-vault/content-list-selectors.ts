import {createSelector} from "@reduxjs/toolkit";
import {ContentType} from "../ui/content/content-interface";
import {selectNotesState} from "./notes/notes-selectors";
import {selectNoteTemplatesState} from "./note-templates/note-templates-selectors";
import {ContentData} from "../ui/content/content-selctors";
import {selectTaskListsState} from "./task-lists/task-lists-selectors";
import {selectContentListFilters, selectContentListPage} from "../ui/view/view-selectors";
import {ListingMetadata} from "../../common/listing-metadata";
import {selectNotesTagsState} from "./notes-tags/notes-tags-selectors";
import {selectNoteTemplatesTagsState} from "./note-templates-tags/note-template-tags-selectors";
import {selectTaskListsTagsState} from "./task-lists-tags/task-lists-tags-selectors";
import {OrderBy} from "../../common/order-by-enum";
import {OrderDirection} from "../../common/order-direction-enum";

export const contentListPageSize = 12;

export interface ContentListData {
  meta: ListingMetadata,
  list: ContentData[]
}

export const selectContentList = createSelector([
  selectContentListPage, selectContentListFilters,
  selectNotesState, selectNoteTemplatesState, selectTaskListsState,
  selectNotesTagsState, selectNoteTemplatesTagsState, selectTaskListsTagsState
], (
  currentPage, filters,
  notes, templates, taskLists,
  notesTags, templatesTags, taskListTags
) => {
  const noteContent: ContentData[] = notes.ids.map(noteId => {
    return {
      type: ContentType.NOTE,
      data: notes.entities[noteId],
    }
  })

  const templateContent: ContentData[] = templates.ids.map(templateId => {
    return {
      type: ContentType.NOTE_TEMPLATE,
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
    // Filter content by name
    if (!content.data.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filter content by type
    if (!filters.contentTypes.includes(content.type)) {
      return false;
    }

    // Filter content by tags
    if (filters.tags.length > 0) {
      let contentTags: string[];
      if (content.type === ContentType.NOTE) {
        contentTags = notesTags.ids
          .map(id => notesTags.entities[id])
          .filter(noteTag => noteTag.noteId === content.data.id)
          .map(noteTag => noteTag.tagId)
      }
      else if (content.type === ContentType.NOTE_TEMPLATE) {
        contentTags = templatesTags.ids
          .map(id => templatesTags.entities[id])
          .filter(templateTag => templateTag.templateId === content.data.id)
          .map(templateTag => templateTag.tagId)
      }
      else {
        contentTags = taskListTags.ids
          .map(id => taskListTags.entities[id])
          .filter(taskListTag => taskListTag.taskListId === content.data.id)
          .map(taskListTag => taskListTag.tagId)
      }

      if (contentTags.length > 0) {
        for (const filterTag of filters.tags) {
          if (!contentTags.includes(filterTag)) {
            return false;
          }
        }
      }
      else {
        return false;
      }
    }

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
    .slice(contentListPageSize * (currentPage - 1), contentListPageSize * (currentPage - 1) + contentListPageSize);

  const meta: ListingMetadata = {
    total: allContent.length,
    pageSize: contentListPageSize,
    currentPage: currentPage
  }

  return {
    meta: meta,
    list: contentListPage
  } as ContentListData
})
