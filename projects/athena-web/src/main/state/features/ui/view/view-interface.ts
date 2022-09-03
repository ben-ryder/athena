import {ContentType} from "../content/content-interface";
import {OrderBy, OrderDirection} from "../../open-vault/open-vault-interfaces";

export enum ViewModes {
  FOLDER_VIEW = "FOLDER_VIEW",
  LIST_VIEW = "LIST_VIEW",
  TAGS_VIEW = "TAGS_VIEW"
}

export interface ListViewFilters {
  contentTypes: ContentType[],
  search: string,
  orderBy: OrderBy,
  orderDirection: OrderDirection,
  tags: string[]
}

export interface UIViewState {
  currentViewMode: ViewModes,
  listView: {
    filters: ListViewFilters,
    currentPage: number
  }
}