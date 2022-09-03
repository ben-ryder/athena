import {ApplicationState} from "../../../state-interface";

export const selectCurrentViewMode = (state: ApplicationState) => state.ui.view.currentViewMode;

export const selectListFilters = (state: ApplicationState) => state.ui.view.listView.filters;

export const selectCurrentPage = (state: ApplicationState) => state.ui.view.listView.currentPage;
