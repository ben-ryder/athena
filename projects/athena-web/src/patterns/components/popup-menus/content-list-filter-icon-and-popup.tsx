import {ContentWithPopup} from "./content-with-popup";
import classNames from "classnames";
import {Filter} from "lucide-react";
import {Button, iconSizes, Input, MultiSelect, Select} from "@ben-ryder/jigsaw";
import React from "react";
import {TagSelector} from "../tag-selector/tag-selector";

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
        <form className="p-2 max-w-[350px]">
          <div className="">
            <Input id="filters-search" label="Search" type="text" placeholder="search content..." />
          </div>
          <div className="mt-2">
            <MultiSelect
              id="filters-content-type" label="Content Types" placeholder="select types..."
              options={[
                {
                  name: "Notes",
                  value: "notes"
                },
                {
                  name: "Templates",
                  value: "templates"
                },
                {
                  name: "Task Lists",
                  value: "taskLists"
                }
              ]}
              currentOptions={[
                {
                  name: "Notes",
                  value: "notes"
                },
                {
                  name: "Templates",
                  value: "templates"
                },
                {
                  name: "Task Lists",
                  value: "taskLists"
                }
              ]}
              onOptionsChange={() => {}}
            />
          </div>
          <div className="mt-2">
            <p className="font-bold text-br-whiteGrey-100">Sort By</p>

            <div className="flex items-center">
              <Select
                className="w-[60%]"
                id="filters-sort-field" label="Sort Field" hideLabel={true}
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
                className="w-[40%] ml-2"
                id="filters-sort-order" label="Sort Order" hideLabel={true}
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
            <MultiSelect
              id="filters-tags" label="Tags" placeholder="select tags..."
              options={[
                {
                  name: "Tag 1",
                  value: "tag 2"
                },
                {
                  name: "Tag 2",
                  value: "tag 2"
                },
                {
                  name: "Tag 3",
                  value: "tag 3"
                }
              ]}
              currentOptions={[
                {
                  name: "Tag 1",
                  value: "tag 1"
                },
                {
                  name: "Tag 2",
                  value: "tag 2"
                }
              ]}
              onOptionsChange={() => {}}
            />
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