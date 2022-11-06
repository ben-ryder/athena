import * as A from "@automerge/automerge";

/**
 * Base Entities
 */
export interface BaseEntity {
  id: string,
  createdAt: string,
  updatedAt: string,
}

export interface EntityTable<T> {
  entities: {[key: string]: T},
  ids: string[]
}

export type EntityWithoutId<T> = Omit<T, "id">

/**
 * Notes
 */
export interface NoteContent {
  name: A.Text,
  body: A.Text,
  tags: string[]
}
export interface NoteEntity extends BaseEntity, NoteContent {}
export type NotesTable = EntityTable<NoteEntity>;

/**
 * Tags
 */
export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}
export interface TagEntity extends BaseEntity, TagContent {}
export type TagsTable = EntityTable<TagEntity>;

/**
 * Task Lists
 */
export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}

// Tasks
export interface TaskContent {
  name: string,
  status: TaskStatus,
  taskListId: string
}
export interface TaskEntity extends BaseEntity, TaskContent {}
export type TasksTable = EntityTable<TaskEntity>;

// Tasks Lists
export interface TaskListContent {
  name: string,
  tags: string[]
}
export interface TaskListEntity extends BaseEntity, TaskListContent {}
export type TaskListsTable = EntityTable<TaskListEntity>;

/**
 * Note Templates
 */
export interface NoteTemplateContent extends NoteContent {}
export interface NoteTemplateEntity extends NoteEntity {}
export type NoteTemplatesTable = EntityTable<NoteTemplateEntity>;


export interface AthenaDatabase {
  tags: TagsTable,
  notes: NotesTable,
  noteTemplates: NoteTemplatesTable,
  tasks: TasksTable,
  taskLists: TaskListsTable,
}
