import {ContentList} from "./content-list";
import React from "react";
import {ContentListFilterIconAndPopup} from "./popup-menus/content-list-filter-icon-and-popup";


export function ListView() {
  return (
    <div>
      <div className="mt-4 mx-4 flex justify-end items-center">
        <ContentListFilterIconAndPopup />
      </div>
      <ContentList />
    </div>
  )
}
