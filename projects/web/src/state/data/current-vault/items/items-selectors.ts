import {ApplicationState} from "../../../application-state";

export const selectAllItems = (state: ApplicationState) => {
	return state.data.current.vault.db.items.ids.map(id => {})
};
