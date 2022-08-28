import {ContentType} from "../content/content-interface";

export enum ViewModes {
  FOLDER_VIEW = "FOLDER_VIEW",
  LIST_VIEW = "LIST_VIEW",
  TAGS_VIEW = "TAGS_VIEW"
}

export enum ListViewSection {
  LIST = "LIST",
  QUERIES = "QUERIES"
}

export interface ListViewFilters {
  contentType: ContentType | null,
  pageSize: number,
  currentPage: number
}

export interface UIViewState {
  currentViewMode: ViewModes,
  listView: {
    currentSection: ListViewSection
    filters: ListViewFilters
  }
}