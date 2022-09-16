export enum ContentType {
  NOTE = "NOTE",
  TEMPLATE = "TEMPLATE",
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