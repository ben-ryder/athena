import {ApplicationState} from "../../../state-interface";

export const selectTagsState = (state: ApplicationState) => state.openVault.tags;
