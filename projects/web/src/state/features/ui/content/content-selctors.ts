import {createSelector} from "@reduxjs/toolkit";
import {Content, ContentType} from "./content-interface";
import {ApplicationState} from "../../../store";
import {
  DatabaseNote,
  DatabaseNoteTemplate,
  DatabaseTaskList,
  NotesTable,
  NoteTemplatesTable, TaskListsTable
} from "../../document/document-interface";

export const selectRawActiveContent = (state: ApplicationState) => state.ui.content.activeContent;
export const selectRawOpenContent = (state: ApplicationState) => state.ui.content.openContent;

export const selectNoteEntities = (state: ApplicationState) => state.document.notes;
export const selectTemplateEntities = (state: ApplicationState) => state.document.noteTemplates;
export const selectTaskListEntities = (state: ApplicationState) => state.document.taskLists;

export type ContentData = {
  type: ContentType.NOTE,
  data: DatabaseNote
} | {
  type: ContentType.NOTE_TEMPLATE,
  data: DatabaseNoteTemplate
} | {
  type: ContentType.TASK_LIST,
  data: DatabaseTaskList
}

function parseContent(
  content: Content,
  notes: NotesTable,
  noteTemplates: NoteTemplatesTable,
  taskLists: TaskListsTable
): ContentData {
  if (content.type === ContentType.NOTE) {
    return {
      type: ContentType.NOTE,
      data: notes.byId(content.id)
    }
  }
  else if (content.type === ContentType.NOTE_TEMPLATE) {
    return {
      type: ContentType.NOTE_TEMPLATE,
      data: noteTemplates.byId(content.id)
    }
  }
  else {
    return {
      type: ContentType.TASK_LIST,
      data: taskLists.byId(content.id)
    }
  }
}

export const selectActiveContent = createSelector([
  selectRawActiveContent,
  selectNoteEntities,
  selectTemplateEntities,
  selectTaskListEntities
], (activeContent, noteEntities, templateEntities, taskListEntities) => {
  return activeContent
    ? parseContent(activeContent, noteEntities, templateEntities, taskListEntities)
    : null
})

export const selectOpenContent = createSelector([
  selectRawOpenContent,
  selectNoteEntities,
  selectTemplateEntities,
  selectTaskListEntities
], (openContent, noteEntities, templateEntities, taskListEntities) => {
  return openContent.map((content: Content) => parseContent(content, noteEntities, templateEntities, taskListEntities));
})
