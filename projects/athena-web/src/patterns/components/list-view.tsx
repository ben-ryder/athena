import {ContentList} from "./content-list";
import {Accordion, Button, Input} from "@ben-ryder/jigsaw";
import React from "react";

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
      <div className="mt-4 mx-4">
        <Accordion items={[{
          title: "Filters",
          content: <ListFilters />
        }]} />
      </div>
      <ContentList />
    </div>
  )
}
