export interface RenameActionPayload {
  id: string,
  name: string
}

export interface MoveActionPayload {
  id: string,
  folderId: string | null
}

export interface DeleteActionPayload {
  id: string
}

export interface UpdateTagsPayload {
  id: string,
  tags: string[]
}
