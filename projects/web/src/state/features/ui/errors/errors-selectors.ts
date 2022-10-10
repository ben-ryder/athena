import {ApplicationState} from "../../../store";

export const selectApplicationError = (state: ApplicationState) => state.ui.errors.applicationError;
