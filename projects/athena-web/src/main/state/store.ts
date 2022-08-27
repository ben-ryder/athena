import { configureStore } from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {uiReducer} from "./features/ui/ui-reducer";
//import {usersSlice} from "./features/users/users-slice";
import {vaultsSlice} from "./features/vaults/vaults-slice";
import {openVaultReducer} from "./features/open-vault/open-vault-reducer";
import {ApplicationState} from "./state-interface";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    //users: usersSlice,
    vaults: vaultsSlice,
    openVault: openVaultReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector
