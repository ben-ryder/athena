import {UIContentState} from "./content/content-interface";
import {UIViewState} from "./view/view-interface";
import {UIModalsState} from "./modals/modals-interface";

export interface UIState {
  content: UIContentState,
  view: UIViewState,
  modals: UIModalsState
}