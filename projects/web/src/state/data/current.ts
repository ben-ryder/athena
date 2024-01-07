import {combineReducers} from "@reduxjs/toolkit";
import { databaseReducer } from "./database/database";

export const currentDatabaseReducer = combineReducers({
	db: databaseReducer,
});
export type CurrentDatabaseState = ReturnType<typeof currentDatabaseReducer>

export const currentDataReducer = combineReducers({
	database: currentDatabaseReducer,
});
export type CurrentDataState = ReturnType<typeof currentDataReducer>
