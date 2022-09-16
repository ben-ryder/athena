import {AnyAction, combineReducers, configureStore, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {uiReducer} from "./features/ui/ui-reducer";
//import {usersSlice} from "./features/users/users-slice";
import {vaultsSlice} from "./features/vaults/vaults-slice";
import {openVaultReducer} from "./features/open-vault/open-vault-reducer";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['openVault']
}

const rootAppReducer = combineReducers({
  ui: uiReducer,
  //users: usersSlice,
  vaults: vaultsSlice,
  openVault: openVaultReducer
})

const rootReducer = persistReducer(persistConfig, rootAppReducer);

export const store = configureStore({
  reducer: rootReducer
})

export type ApplicationState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ApplicationState,
  unknown,
  AnyAction
  >
export type AppThunkDispatch = ThunkDispatch<ApplicationState, unknown, AnyAction>

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector

export const persistor = persistStore(store);
