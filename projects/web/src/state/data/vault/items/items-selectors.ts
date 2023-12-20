import {ApplicationState} from "../../../store";

export const selectAllItems = (state: ApplicationState) => state.currentVault.items;
