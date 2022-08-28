import {combineReducers} from "@reduxjs/toolkit";
import {uiContentReducer} from "./content/content-reducer";
import {uiViewReducer} from "./view/view-reducer";


export const uiReducer = combineReducers({
  content: uiContentReducer,
  view: uiViewReducer
})
