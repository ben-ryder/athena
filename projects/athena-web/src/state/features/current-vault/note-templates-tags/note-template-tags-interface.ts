
export interface NoteTemplateTag {
  id: string,
  templateId: string,
  tagId: string
}

export interface NoteTemplatesTagsState {
  entities: {
    [key: string]: NoteTemplateTag
  },
  ids: string[]
}
