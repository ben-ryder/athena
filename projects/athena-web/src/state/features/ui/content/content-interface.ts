export enum ContentType {
  NOTE = "NOTE",
  NOTE_TEMPLATE = "NOTE_TEMPLATE",
  TASK_LIST = "TASK_LIST"
}

export interface Content {
  type: ContentType,
  id: string
}

export interface UIContentState {
  openContent: Content[],
  activeContent: Content | null,
}