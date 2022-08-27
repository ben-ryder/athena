export enum ContentType {
  NOTE = "NOTE",
  TEMPLATE = "TEMPLATE",
  TASK_LIST = "TASK_LIST"
}
export interface Content {
  type: ContentType,
  id: string
}

export interface UIState {
  currentUser: string | null,
  currentVault: string | null,
  content: {
    openContent: Content[],
    activeContent: Content | null,
  }
}