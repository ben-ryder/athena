import {ContentList} from "./content-list";
import {Accordion, Button, IconButton, iconColorClassNames, iconSizes, Input} from "@ben-ryder/jigsaw";
import React from "react";
import { Filter } from "lucide-react";
import {FilterIcon} from "../element/filter-icon";
import classNames from "classnames";
import {ContentListFilterIconAndPopup} from "./popup-menus/content-list-filter-icon-and-popup";

export function ListFilters() {
  return (
    <div className="mx-1">
      <div>
        <Input id="search" label="Search" hideLabel={true} placeholder="search content title..." />
      </div>
      <div className="flex justify-end">
        <Button styling="secondary">Clear Filters</Button>
        <Button>Apply Filters</Button>
      </div>
    </div>
  )
}


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
