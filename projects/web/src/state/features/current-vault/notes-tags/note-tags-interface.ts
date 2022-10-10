export interface NoteTag {
  id: string,
  noteId: string,
  tagId: string
}

export interface NotesTagsState {
  entities: {
    [key: string]: NoteTag
  },
  ids: string[]
}
