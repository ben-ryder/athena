import {combineReducers} from "@reduxjs/toolkit";
import { databaseReducer } from "./database/database";
import { currentDatabaseReducer, currentDataReducer } from "./current";

export const dataReducer = combineReducers({
	current: currentDataReducer,
});
export type DataState = ReturnType<typeof dataReducer>
