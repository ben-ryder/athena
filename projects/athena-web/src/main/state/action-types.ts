
export enum UsersActions {
  CREATE = "users/create",
  UPDATE = "users/update",
  DELETE = "users/delete"
}

export enum VaultsActions {
  CREATE = "vaults/create",
  UPDATE = "vaults/update",
  DELETE = "vaults/delete"
}

export enum TagsActions {
  CREATE = "tags/create",
  UPDATE = "tags/update",
  DELETE = "tags/delete"
}

export enum NotesActions {
  CREATE = "notes/create",
  RENAME = "notes/update/rename",
  UPDATE_BODY = "notes/update/body",
  UPDATE_TAGS = "notes/update/tags",
  MOVE = "notes/update/move",
  DELETE = "notes/delete"
}

export enum TemplatesActions {
  CREATE = "templates/create",
  RENAME = "templates/update/rename",
  UPDATE_BODY = "templates/update/body",
  UPDATE_TAGS = "templates/update/tags",
  MOVE = "templates/update/move",
  UPDATE_TARGET = "templates/update/target",
  DELETE = "templates/delete"
}

export enum FoldersActions {
  CREATE = "folders/create",
  RENAME = "folders/update/rename",
  MOVE = "folders/update/move",
  DELETE = "folders/delete"
}

export enum QueriesActions {
  CREATE = "queries/create",
  UPDATE = "queries/update",
  DELETE = "queries/delete"
}

export enum TaskListsActions {
  CREATE = "taskLists/create",
  RENAME = "taskLists/update/rename",
  MOVE = "taskLists/update/move",
  UPDATE_TAGS = "taskLists/update/tags",
  DELETE = "taskLists/delete"
}

export enum TasksActions {
  CREATE = "task/create",
  RENAME = "task/update/rename",
  UPDATE_STATUS = "task/update/status",
  DELETE = "task/delete"
}

export enum UIActions {
  // Global Actions (will affect pretty much all state)
  SWITCH_USER = "switch/user",
  SWITCH_VAULT = "switch/vault",

  // Content List
  OPEN_NOTE = "open/note",
  OPEN_TEMPLATE = "open/template",
  OPEN_LIST= "open/taskList",

  SWITCH_CONTENT = "content/switch",
  CLOSE_CONTENT = "content/close"
}