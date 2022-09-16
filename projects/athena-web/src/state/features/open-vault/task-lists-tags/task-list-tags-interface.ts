
export interface TaskListTag {
  id: string,
  taskListId: string,
  tagId: string
}

export interface TaskListsTagsState {
  entities: {
    [key: string]: TaskListTag
  },
  ids: string[]
}
