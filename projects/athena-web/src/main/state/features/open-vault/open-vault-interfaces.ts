import {BaseDatabaseEntity} from "../../common/base-database-entity";
import {ContentType} from "../ui/content/content-interface";

// todo: move all these interfaces to correct slice folder

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

export interface Folder extends BaseDatabaseEntity {
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
  queryId: string
}
export interface Query extends BaseDatabaseEntity {
  name: string,
  contentTypes: ContentType[] | null
  search: string | null,
  orderBy: OrderBy,
  orderDirection: OrderDirection
}

export interface TaskListTag {
  id: string,
  taskListId: string,
  tagId: string
}

export interface NotesTagsState {
  entities: {
    [key: string]: NoteTag
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

export interface TaskListsTagsState {
  entities: {
    [key: string]: TaskListTag
  },
  ids: string[]
}
