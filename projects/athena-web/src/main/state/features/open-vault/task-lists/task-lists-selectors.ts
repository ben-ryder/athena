import {ApplicationState} from "../../../state-interface";

export const selectTaskListsState = (state: ApplicationState) => state.openVault.taskLists;
