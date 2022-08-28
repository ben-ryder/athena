import {UIContentState} from "./content/content-interface";
import {UIViewState} from "./view/view-interface";

export interface UIState {
  content: UIContentState,
  view: UIViewState
}