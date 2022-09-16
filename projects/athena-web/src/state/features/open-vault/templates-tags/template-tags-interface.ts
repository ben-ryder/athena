
export interface TemplateTag {
  id: string,
  templateId: string,
  tagId: string
}

export interface TemplatesTagsState {
  entities: {
    [key: string]: TemplateTag
  },
  ids: string[]
}
