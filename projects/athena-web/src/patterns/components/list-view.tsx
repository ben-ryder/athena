import {ContentList} from "./content-list";
import React from "react";
import {ContentListFilterIconAndPopup} from "./popup-menus/content-list-filter-icon-and-popup";


export function ListView() {
  return (
    <div>
      <div className="mt-4 mx-4 flex justify-between items-center">
        <button className="text-br-whiteGrey-100 underline hover:text-br-teal-600 font-bold underline-offset-4">Saved Queries</button>
        <ContentListFilterIconAndPopup />
      </div>
      <ContentList />
    </div>
  )
}
