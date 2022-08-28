import {ApplicationState} from "../../../state-interface";

export const selectCurrentViewMode = (state: ApplicationState) => state.ui.view.currentViewMode;

export const selectCurrentListViewSection = (state: ApplicationState) => state.ui.view.listView.currentSection;
