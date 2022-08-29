import {createReducer} from "@reduxjs/toolkit";
import {switchCurrentViewMode} from "./view-actions";
import {UIViewState, ViewModes} from "./view-interface";

export const initialUIViewState: UIViewState = {
  currentViewMode: ViewModes.LIST_VIEW,
  listView: {
    filters: {
      search: null,
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
  }
);
