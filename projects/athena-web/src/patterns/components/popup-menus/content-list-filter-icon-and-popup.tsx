import {ContentWithPopup} from "./content-with-popup";
import classNames from "classnames";
import {Filter} from "lucide-react";
import {Button, iconSizes, Input, Select} from "@ben-ryder/jigsaw";
import React from "react";

export function ContentListFilterIconAndPopup() {
  return (
    <ContentWithPopup
      label="Open Filter Menu"
      content={
        <button
          className={classNames(
            "p-1 flex",
            "text-br-whiteGrey-50 hover:text-br-teal-600"
          )}
          aria-label="Open Filter Menu"
        >
          <span className="mr-1 font-bold underline underline-offset-4">Filters</span>
          <Filter size={iconSizes.small} />
        </button>
      }
      popupContent={
        <form className="p-2">
          <div className="">
            <Input id="search" label="Search" type="text" placeholder="search content..." />
          </div>
          <div className="mt-2">
            <p className="font-bold text-br-whiteGrey-100">Content Types</p>
          </div>
          <div className="mt-2">
            <p className="font-bold text-br-whiteGrey-100">Sort By</p>

            <div className="">
              <Select
                id="sort-field" label="Sort Field" hideLabel={true}
                options={[
                  {
                    name: "Name",
                    value: "name"
                  },
                  {
                    name: "Created At",
                    value: "createdAt"
                  },
                  {
                    name: "Updated At",
                    value: "updatedAt"
                  }

                ]}
                currentOption={{
                  name: "Name",
                  value: "name"
                }}
                onOptionChange={() => {}}
              />
              <Select
                id="sort-order" label="Sort Order" hideLabel={true}
                options={[
                  {
                    name: "ASC",
                    value: "ASC"
                  },
                  {
                    name: "DESC",
                    value: "DESC"
                  }
                ]}
                currentOption={{
                  name: "DESC",
                  value: "DESC"
                }}
                onOptionChange={() => {}}
              />
            </div>
          </div>

          <div className="mt-2">
            <p className="font-bold text-br-whiteGrey-100">Tags</p>
          </div>

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" type="button" className="mr-2">Clear</Button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      }
    />
  )
}