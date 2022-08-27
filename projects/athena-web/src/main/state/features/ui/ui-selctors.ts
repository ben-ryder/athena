import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../state-interface";
import {Content, ContentType} from "./ui-interfaces";
import {Note, TaskList, Template} from "../open-vault/open-vault-interfaces";

export const selectRawActiveContent = (state: ApplicationState) => state.ui.content.activeContent;
export const selectRawOpenContent = (state: ApplicationState) => state.ui.content.openContent;

export const selectNoteEntities = (state: ApplicationState) => state.openVault.notes.entities;
export const selectTemplateEntities = (state: ApplicationState) => state.openVault.templates.entities;
export const selectTaskListEntities = (state: ApplicationState) => state.openVault.taskLists.entities;

export type ContentData = {
  type: ContentType.NOTE,
  data: Note
} | {
  type: ContentType.TEMPLATE,
  data: Template
} | {
  type: ContentType.TASK_LIST,
  data: TaskList
}

function parseContent(
  content: Content,
  noteEntities: {[k: string]: Note},
  templateEntities: {[k: string]: Template},
  taskListEntities: {[k: string]: TaskList}
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
  return openContent.map(content => parseContent(content, noteEntities, templateEntities, taskListEntities));
})