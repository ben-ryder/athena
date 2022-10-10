import {VaultsState} from "./vaults-interfaces";
import {initialVaults} from "./vaults-reducer";
import {AnyAction} from "@reduxjs/toolkit";

export function vaultsSlice(state: VaultsState | undefined, action: AnyAction) {
  if (state === undefined) {
    return initialVaults;
  }

  switch (action.type) {
    default:
      return state;
  }
}