import {combineReducers} from "@reduxjs/toolkit";
import {uiContentReducer} from "./content/content-reducer";
import {uiViewReducer} from "./view/view-reducer";
import {uiModalsReducer} from "./modals/modals-reducer";
import {uiErrorsReducer} from "./errors/errors-reducers";


export const uiReducer = combineReducers({
  content: uiContentReducer,
  view: uiViewReducer,
  modals: uiModalsReducer,
  errors: uiErrorsReducer
})
