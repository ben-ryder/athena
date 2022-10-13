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

export interface NoteTemplateContent extends NoteContent {
  targetFolderId: string | null
}
export interface DatabaseNoteTemplate extends BaseDatabaseEntity, NoteTemplateContent {}
export interface NoteTemplate extends DatabaseNoteTemplate {
  tags: Tag[]
}

export interface DatabaseNoteTemplateTag {
  id: string,
  templateId: string,
  tagId: string
}

export interface NoteContent {
  name: string,
  body: string,
  folderId: string | null
}
export interface DatabaseNote extends BaseDatabaseEntity, NoteContent {}
export interface Note extends DatabaseNote {
  tags: Tag[]
}

export interface DatabaseNoteTag {
  id: string,
  noteId: string,
  tagId: string
}

export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}
export interface DatabaseTag extends BaseDatabaseEntity, TagContent{}
export interface Tag extends DatabaseTag {}

export interface TaskListContent {
  name: string,
  folderId: string | null
}
export interface DatabaseTaskList extends BaseDatabaseEntity, TaskListContent {}
export interface TaskList extends DatabaseTaskList {
  tasks: Task[]
}

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
export interface Task extends DatabaseTaskList {}

export interface DatabaseTaskListTag {
  id: string,
  taskListId: string,
  tagId: string
}

export interface Document {
  folders: A.Table<DatabaseFolder>,
  noteTemplates: A.Table<DatabaseNoteTemplate>,
  noteTemplatesTags: A.Table<DatabaseNoteTemplateTag>,
  notes: A.Table<DatabaseNote>,
  notesTags: A.Table<DatabaseNoteTag>,
  tags: A.Table<DatabaseTag>,
  taskLists: A.Table<DatabaseTaskList>,
  tasks: A.Table<DatabaseTask>,
  taskListsTags: A.Table<DatabaseTaskListTag>
}

export type DocumentState = A.FreezeObject<Document>;
