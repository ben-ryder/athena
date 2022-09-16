
export interface QueryTag {
  tagId: string,
  queryId: string
}

export interface QueriesTagsState {
  entities: {
    [key: string]: QueryTag
  },
  ids: string[]
}