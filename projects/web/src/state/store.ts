import {AnyAction, combineReducers, configureStore, ThunkAction, ThunkDispatch} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {UIState} from "./features/ui/ui-interface";
import {DocumentState} from "./features/document/document-interface";
import {documentReducer} from "./features/document/document-reducer";
import {uiReducer} from "./features/ui/ui-reducer";

export interface ApplicationState {
  ui: UIState,
  document: DocumentState
}

export const rootReducer = combineReducers({
  ui: uiReducer,
  document: documentReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['document', 'payload'],
      },
    }),
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
