import {AnyAction, combineReducers, configureStore, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {uiReducer} from "./features/ui/ui-reducer";
//import {usersSlice} from "./features/users/users-slice";
import {vaultsSlice} from "./features/vaults/vaults-slice";
import {currentVaultReducer} from "./features/current-vault/current-vault-reducer";

import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {deleteFolder} from "./features/current-vault/folders/folders-actions";
import {UIState} from "./features/ui/ui-interface";
import {VaultsState} from "./features/vaults/vaults-interfaces";
//import {UsersState} from "./features/users/users-interfaces";
import {CurrentVaultInterface} from "./features/current-vault/current-vault-interface";
import {deleteFoldersReducer} from "./features/current-vault/folders/delete-folders-reducer";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['currentVault']
}

const combinedSliceReducers = combineReducers({
  ui: uiReducer,
  //users: usersSlice,
  vaults: vaultsSlice,
  currentVault: currentVaultReducer
})

export interface ApplicationState {
  ui: UIState,
  vaults: VaultsState,
  //users: UsersState,
  currentVault: CurrentVaultInterface
}

function globalReducers(state: ApplicationState, action: AnyAction) {
  if (deleteFolder.match(action)) {
   return deleteFoldersReducer(state, action.payload);
  }
  else {
    return state;
  }
}

function rootAppReducer(state: ApplicationState | undefined, action: AnyAction) {
  const intermediateState = combinedSliceReducers(state, action);
  return globalReducers(intermediateState, action);
}

const rootReducer = persistReducer(persistConfig, rootAppReducer);

export const store = configureStore({
  reducer: rootReducer
})

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
