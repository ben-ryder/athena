import {BaseEntity} from "../../common/base-entity";


export interface Note extends BaseEntity {
  name: string,
  body: string,
  folderId: string | null
}

export interface Tag extends BaseEntity {
  name: string,
  textColour: string,
  backgroundColour: string,
}

export interface Template extends Note {
  targetFolderId: string | null
}

export interface NoteTag {
  id: string,
  noteId: string,
  tagId: string
}

export interface TemplateTag {
  id: string,
  templateId: string,
  tagId: string
}

export interface Folder extends BaseEntity {
  name: string,
  parentId: string | null,
}

export enum OrderBy {
  CREATED_AT = "CREATED_AT",
  UPDATED_AT = "UPDATED_AT",
  NAME = "NAME"
}
export enum OrderDirection {
  ASC = "ASC",
  DESC = "DESC",
}
export interface QueryTag {
  tagId: string,
  queryId: string,
  order: number
}
export interface Query extends BaseEntity {
  name: string,
  orderBy: OrderBy,
  orderDirection: OrderDirection,
}

export interface TaskList extends BaseEntity {
  name: string,
  folderId: string | null
}

export interface TaskListTag {
  id: string,
  taskListId: string,
  tagId: string
}

export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}
export interface Task extends BaseEntity {
  name: string,
  status: TaskStatus,
  taskListId: string
}

export interface TagsState {
  entities: {
    [key: string]: Tag
  },
  ids: string[]
}

export interface NotesState {
  entities: {
    [key: string]: Note
  },
  ids: string[]
}

export interface NotesTagsState {
  entities: {
    [key: string]: NoteTag
  },
  ids: string[]
}

export interface TemplatesState {
  entities: {
    [key: string]: Template
  },
  ids: string[]
}

export interface TemplatesTagsState {
  entities: {
    [key: string]: TemplateTag
  },
  ids: string[]
}

export interface FoldersState {
  entities: {
    [key: string]: Folder
  },
  ids: string[]
}

export interface QueriesState {
  entities: {
    [key: string]: Query
  },
  ids: string[]
}

export interface QueriesTagsState {
  entities: {
    [key: string]: QueryTag
  },
  ids: string[]
}

export interface TaskListsState {
  entities: {
    [key: string]: TaskList
  },
  ids: string[]
}

export interface TaskListsTagsState {
  entities: {
    [key: string]: TaskListTag
  },
  ids: string[]
}

export interface TasksState {
  entities: {
    [key: string]: Task
  },
  ids: string[]
}

export interface OpenVaultState {
  tags: TagsState;
  notes: NotesState;
  notesTags: NotesTagsState;
  templates: TemplatesState;
  templatesTags: TemplatesTagsState;
  folders: FoldersState;
  queries: QueriesState;
  queriesTags: QueriesTagsState;
  taskLists: TaskListsState;
  taskListsTags: TaskListsTagsState
  tasks: TasksState;
}
