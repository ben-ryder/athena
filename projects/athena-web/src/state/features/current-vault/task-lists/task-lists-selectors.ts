import {ApplicationState} from "../../../store";

export const selectTaskListsState = (state: ApplicationState) => state.currentVault.taskLists;
