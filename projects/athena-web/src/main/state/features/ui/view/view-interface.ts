import {ContentType} from "../content/content-interface";
import {OrderBy, OrderDirection} from "../../open-vault/open-vault-interfaces";

export enum ViewModes {
  FOLDER_VIEW = "FOLDER_VIEW",
  LIST_VIEW = "LIST_VIEW",
  TAGS_VIEW = "TAGS_VIEW"
}

export interface ListViewFilters {
  contentTypes: ContentType[] | null,
  search: string | null,
  orderBy: OrderBy,
  orderDirection: OrderDirection,
  currentPage: number
}

export interface UIViewState {
  currentViewMode: ViewModes,
  listView: {
    filters: ListViewFilters
  }
}