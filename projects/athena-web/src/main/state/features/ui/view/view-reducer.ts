import {createReducer} from "@reduxjs/toolkit";
import {decrementPage, incrementPage, resetListFilters, switchCurrentViewMode, updateListFilters} from "./view-actions";
import {ListViewFilters, UIViewState, ViewModes} from "./view-interface";
import {ContentType} from "../content/content-interface";
import {OrderBy, OrderDirection} from "../../open-vault/open-vault-interfaces";

export const defaultListFilters: ListViewFilters = {
  search: "",
  contentTypes: [ContentType.NOTE, ContentType.TASK_LIST],
  orderBy: OrderBy.NAME,
  orderDirection: OrderDirection.ASC,
  tags: []
}

export const initialUIViewState: UIViewState = {
  currentViewMode: ViewModes.LIST_VIEW,
  listView: {
    filters: defaultListFilters,
    currentPage: 1
  }
};

export const uiViewReducer = createReducer(
  initialUIViewState,
  (builder) => {
    builder.addCase(switchCurrentViewMode, (state, action) => {
      state.currentViewMode = action.payload;
    })

    builder.addCase(updateListFilters, (state, action) => {
      state.listView.filters = action.payload;
      state.listView.currentPage = 1;
    })

    builder.addCase(resetListFilters, (state, action) => {
      state.listView.filters = defaultListFilters;
      state.listView.currentPage = 1;
    })

    builder.addCase(incrementPage, (state) => {
      state.listView.currentPage++;
    })

    builder.addCase(decrementPage, (state) => {
      if (state.listView.currentPage > 1) {
        state.listView.currentPage--;
      }
    })
  }
);
