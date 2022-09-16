import {ContentType} from "../content/content-interface";
import {OrderBy, OrderDirection} from "../../open-vault/open-vault-interfaces";

export enum ViewModes {
  FOLDER_VIEW = "FOLDER_VIEW",
  LIST_VIEW = "LIST_VIEW",
  TAGS_VIEW = "TAGS_VIEW"
}

export interface ContentListFilters {
  contentTypes: ContentType[],
  search: string,
  orderBy: OrderBy,
  orderDirection: OrderDirection,
  tags: string[]
}

export interface TagsListFilters {
  search: string,
  orderBy: OrderBy,
  orderDirection: OrderDirection
}

export interface UIViewState {
  currentViewMode: ViewModes,
  contentList: {
    filters: ContentListFilters,
    currentPage: number
  },
  tagsList: {
    filters: TagsListFilters,
    currentPage: number
  }
}