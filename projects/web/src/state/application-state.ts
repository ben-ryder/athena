import { UserDto, VaultDto } from "@localful/common";
import {combineReducers} from "@reduxjs/toolkit";
import {
  UnknownAction,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {dataReducer} from "./data/data-state";
import {VaultDatabase} from "./data/current-vault/vault-state";

export interface ApplicationState {
  status: {
    networkStatus: boolean
    errors: {
      global: boolean
    }
  },
  data: {
    current: {
      vault: {
        id: string,
        db: VaultDatabase
      },
      user: UserDto | null
    },
    vaults: VaultDto[]
  },
  ui: {}
}

export const rootReducer = combineReducers({
  data: dataReducer,
});
export type RootState = ReturnType<typeof rootReducer>


export const store = configureStore({
  reducer: rootReducer,
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ApplicationState,
  unknown,
  UnknownAction
>;
export type AppThunkDispatch = ThunkDispatch<
  ApplicationState,
  unknown,
  UnknownAction
>;

export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
