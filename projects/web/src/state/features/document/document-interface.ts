import * as A from "automerge";

export interface BaseDatabaseEntity {
  id: string,
  createdAt: string,
  updatedAt: string,
}

export interface FolderContent {
  name: string,
  parentId: string | null,
}
export interface DatabaseFolder extends BaseDatabaseEntity, FolderContent {}
export interface Folder extends DatabaseFolder {}
export type FoldersTable = A.Table<DatabaseFolder>;

export interface NoteTemplateContent extends NoteContent {
  targetFolderId: string | null
}
export interface DatabaseNoteTemplate extends BaseDatabaseEntity, NoteTemplateContent {}
export interface NoteTemplate extends DatabaseNoteTemplate {
  tags: Tag[]
}
export type NoteTemplatesTable = A.Table<DatabaseNoteTemplate>;

export interface DatabaseNoteTemplateTag {
  id: string,
  templateId: string,
  tagId: string
}
export type NoteTemplateTagsTable = A.Table<DatabaseNoteTemplateTag>;

export interface NoteContent {
  name: string,
  body: string,
  folderId: string | null
}
export interface DatabaseNote extends BaseDatabaseEntity, NoteContent {}
export interface Note extends DatabaseNote {
  tags: Tag[]
}
export type NotesTable = A.Table<DatabaseNote>;

export interface DatabaseNoteTag {
  id: string,
  noteId: string,
  tagId: string
}
export type NoteTagsTable = A.Table<DatabaseNoteTag>;

export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}
export interface DatabaseTag extends BaseDatabaseEntity, TagContent{}
export interface Tag extends DatabaseTag {}
export type TagsTable = A.Table<DatabaseTag>;

export interface TaskListContent {
  name: string,
  folderId: string | null
}
export interface DatabaseTaskList extends BaseDatabaseEntity, TaskListContent {}
export interface TaskList extends DatabaseTaskList {
  tasks: Task[]
}
export type TaskListsTable = A.Table<DatabaseTaskList>;

export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}
export interface TaskContent {
  name: string,
  status: TaskStatus
}
export interface DatabaseTask extends BaseDatabaseEntity, TaskContent {
  taskListId: string
}
export interface Task extends DatabaseTask {}
export type TasksTable = A.Table<DatabaseTask>;

export interface DatabaseTaskListTag {
  id: string,
  taskListId: string,
  tagId: string
}
export type TaskListTagsTable = A.Table<DatabaseTaskListTag>;


export interface Document {
  folders: FoldersTable,
  noteTemplates: NoteTemplatesTable,
  noteTemplatesTags: NoteTemplateTagsTable,
  notes: NotesTable,
  notesTags: NoteTagsTable,
  tags: TagsTable,
  taskLists: TaskListsTable,
  tasks: TasksTable,
  taskListsTags: TaskListTagsTable
}

export type DocumentState = A.FreezeObject<Document>;

export type EntityWithoutId<T> = Omit<T, "id">
