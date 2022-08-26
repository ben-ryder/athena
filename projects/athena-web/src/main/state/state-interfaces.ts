
export interface DatabaseEntity {
  id: string,
  createdAt: string,
  updatedAt: string,
}

export interface DatabaseNote extends DatabaseEntity {
  name: string,
  body: string,
  tags: string[],
  folderId: string | null
}

export interface Tag extends DatabaseEntity {
  name: string,
  textColour: string,
  backgroundColour: string,
}

export interface Template extends Note {}

export interface Folder extends DatabaseEntity {
  name: string,
  parentId: string | null,
  targetFolderId: string | null
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
  order: number,
  tag: Tag
}
export interface Query extends DatabaseEntity {
  name: string,
  orderBy: OrderBy,
  orderDirection: OrderDirection,
  tags: QueryTag[]
}

export interface TaskList extends DatabaseEntity {
  name: string,
  tags: string[],
  folderId: string | null
}

export interface TaskList extends DatabaseEntity {
  name: string,
}

export enum TaskStatus {
  OPEN = "OPEN",
  COMPLETED = "COMPLETED"
}
export interface Task extends DatabaseEntity {
  name: string,
  status: TaskStatus,
  taskListId: string
}

export interface Vault {
  notes: {
    byId: {
      [key: string]: Note
    },
    allIds: string[];
  };
  tags: {
    byId: {
      [key: string]: Tag
    },
    allIds: string[];
  };
  templates: AutoMerge.Table<Template>;
  folders: AutoMerge.Table<Folder>
  queries: AutoMerge.Table<Query>;
  taskLists: AutoMerge.Table<TaskList>;
  tasks: AutoMerge.Table<Task>;
}

export enum ContentType {
  NOTE = "NOTE",
  TEMPLATE = "TEMPLATE"
}
export interface Content {
  type: ContentType,
  id: string
}

export interface FolderTree {
  name: string,
  content: Content[],
  folders: FolderTree[]
}