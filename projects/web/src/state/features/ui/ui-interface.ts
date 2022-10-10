import {UIContentState} from "./content/content-interface";
import {UIViewState} from "./view/view-interface";
import {UIModalsState} from "./modals/modals-interface";
import {UIErrorsState} from "./errors/errors-interface";

export interface UIState {
  content: UIContentState,
  view: UIViewState,
  modals: UIModalsState,
  errors: UIErrorsState
}