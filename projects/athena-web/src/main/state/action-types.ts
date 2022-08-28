
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

