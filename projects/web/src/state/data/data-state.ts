import {combineReducers} from "@reduxjs/toolkit";
import {currentVaultReducer} from "./current-vault/vault-state";

export const currentDataReducer = combineReducers({
	vault: currentVaultReducer,
});
export type CurrentDataState = ReturnType<typeof currentDataReducer>

export const dataReducer = combineReducers({
	current: currentVaultReducer,
});
export type DataState = ReturnType<typeof dataReducer>
