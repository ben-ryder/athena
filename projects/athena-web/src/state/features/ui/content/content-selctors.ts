import {createSelector} from "@reduxjs/toolkit";
import {Content, ContentType} from "./content-interface";
import {DatabaseNote} from "../../current-vault/notes/notes-interface";
import {DatabaseTemplate} from "../../current-vault/templates/templates-interface";
import {DatabaseTaskList} from "../../current-vault/task-lists/task-lists-interface";
import {ApplicationState} from "../../../store";

export const selectRawActiveContent = (state: ApplicationState) => state.ui.content.activeContent;
export const selectRawOpenContent = (state: ApplicationState) => state.ui.content.openContent;

export const selectNoteEntities = (state: ApplicationState) => state.currentVault.notes.entities;
export const selectTemplateEntities = (state: ApplicationState) => state.currentVault.templates.entities;
export const selectTaskListEntities = (state: ApplicationState) => state.currentVault.taskLists.entities;

export type ContentData = {
  type: ContentType.NOTE,
  data: DatabaseNote
} | {
  type: ContentType.TEMPLATE,
  data: DatabaseTemplate
} | {
  type: ContentType.TASK_LIST,
  data: DatabaseTaskList
}

function parseContent(
  content: Content,
  noteEntities: {[k: string]: DatabaseNote},
  templateEntities: {[k: string]: DatabaseTemplate},
  taskListEntities: {[k: string]: DatabaseTaskList}
): ContentData {
  if (content.type === ContentType.NOTE) {
    return {
      type: ContentType.NOTE,
      data: noteEntities[content.id]
    }
  }
  else if (content.type === ContentType.TEMPLATE) {
    return {
      type: ContentType.TEMPLATE,
      data: templateEntities[content.id]
    }
  }
  else {
    return {
      type: ContentType.TASK_LIST,
      data: taskListEntities[content.id]
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