import {createReducer} from "@reduxjs/toolkit";
import {switchCurrentListViewSection, switchCurrentViewMode} from "./view-actions";
import {ListViewSection, UIViewState, ViewModes} from "./view-interface";

export const initialUIViewState: UIViewState = {
  currentViewMode: ViewModes.LIST_VIEW,
  listView: {
    currentSection: ListViewSection.LIST,
    filters: {
      contentType: null,
      pageSize: 12,
      currentPage: 0
    }
  }
};

export const uiViewReducer = createReducer(
  initialUIViewState,
  (builder) => {
    builder.addCase(switchCurrentViewMode, (state, action) => {
      state.currentViewMode = action.payload;
    })

    builder.addCase(switchCurrentListViewSection, (state, action) => {
      state.listView.currentSection = action.payload;
    })
  }
);
