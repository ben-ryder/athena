import {ApplicationState} from "../../../state-interface";

export const selectCurrentViewMode = (state: ApplicationState) => state.ui.view.currentViewMode;

// Content List
export const selectContentListFilters = (state: ApplicationState) => state.ui.view.contentList.filters;

export const selectContentListPage = (state: ApplicationState) => state.ui.view.contentList.currentPage;

// Tags List
export const selectTagsListFilters = (state: ApplicationState) => state.ui.view.tagsList.filters;

export const selectTagsListPage = (state: ApplicationState) => state.ui.view.tagsList.currentPage;
