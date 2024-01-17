
export type ContentManagerScreens = {
  screen: "list"
} | {
  screen: "new"
} | {
  screen: "edit",
  id: string
}
export type ContentManagerNavigate = (screen: ContentManagerScreens) => void

export interface ContentManagerScreenProps {
  navigate: ContentManagerNavigate
}

export interface ContentManagerContentScreenProps {
  navigate: ContentManagerNavigate
  id: string
}
