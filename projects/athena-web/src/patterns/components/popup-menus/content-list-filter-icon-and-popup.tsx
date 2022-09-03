import {ContentWithPopup} from "./content-with-popup";
import classNames from "classnames";
import {Filter} from "lucide-react";
import {Button, iconSizes, Input, MultiSelect, Select} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {useAppDispatch} from "../../../main/state/store";
import {useSelector} from "react-redux";
import {selectListFilters} from "../../../main/state/features/ui/view/view-selectors";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
//import {updateFilterContentTypes} from "../../../main/state/features/ui/view/view-actions";
import {OrderBy, OrderDirection} from "../../../main/state/features/open-vault/open-vault-interfaces";
import {resetListFilters, updateListFilters} from "../../../main/state/features/ui/view/view-actions";
import { Popover } from "@headlessui/react";
import {defaultListFilters} from "../../../main/state/features/ui/view/view-reducer";

const contentTypeOptions = [
  {
    name: "Notes",
    value: ContentType.NOTE
  },
  {
    name: "Task Lists",
    value: ContentType.TASK_LIST
  },
  {
    name: "Templates",
    value: ContentType.TEMPLATE
  }
];

const orderByOptions = [
  {
    name: "Name",
    value: OrderBy.NAME
  },
  {
    name: "Created At",
    value: OrderBy.CREATED_AT
  },
  {
    name: "Updated At",
    value: OrderBy.UPDATED_AT
  }
];

const orderDirectionOptions = [
  {
    name: "DESC",
    value: OrderDirection.DESC
  },
  {
    name: "ASC",
    value: OrderDirection.ASC
  },
];

export interface ListFilterFormProps {
  onClose: () => void
}


export function ListFilterForm(props: ListFilterFormProps) {
  const dispatch = useAppDispatch();
  const filters = useSelector(selectListFilters);

  const [search, setSearch] = useState<string>(filters.search);
  const [contentTypes, setContentTypes] = useState<ContentType[]>(filters.contentTypes);
  const [orderBy, setOrderBy] = useState<OrderBy>(filters.orderBy);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(filters.orderDirection);
  const [tags, setTags] = useState<string[]>(filters.tags);

  let orderByOption;
  if (orderBy === OrderBy.NAME) {
    orderByOption = {
      name: "Name",
      value: OrderBy.NAME
    }
  }
  else if (orderBy === OrderBy.CREATED_AT) {
    orderByOption = {
      name: "Created At",
      value: OrderBy.CREATED_AT
    }
  }
  else {
    orderByOption = {
      name: "Updated At",
      value: OrderBy.UPDATED_AT
    }
  }

  let orderDirectionOption;
  if (orderDirection === OrderDirection.DESC) {
    orderDirectionOption = {
      name: "DESC",
      value: OrderDirection.DESC
    }
  }
  else {
    orderDirectionOption = {
      name: "ASC",
      value: OrderDirection.ASC
    }
  }

  return (
    <form
      className="p-2 max-w-[350px]"
      onSubmit={(e) => {
        e.preventDefault();

        props.onClose()
        dispatch(updateListFilters({
          search: search,
          contentTypes: contentTypes,
          orderBy: orderBy,
          orderDirection: orderDirection,
          tags: []
        }))
      }}
    >
      <div className="">
        <Input
          id="filters-search" label="Search" type="text" placeholder="search content..."
          value={search} onChange={(e) => {setSearch(e.target.value)}}
        />
      </div>
      <div className="mt-2">
        <MultiSelect
          id="filters-content-type" label="Content Types" placeholder="select types..."
          options={contentTypeOptions}
          currentOptions={contentTypes.map(contentType => {
            if (contentType === ContentType.NOTE) {
              return {
                name: "Notes",
                value: ContentType.NOTE
              }
            }
            else if (contentType === ContentType.TASK_LIST) {
              return {
                name: "Task Lists",
                value: ContentType.TASK_LIST
              }
            }
            else {
             return {
               name: "Templates",
               value: ContentType.TEMPLATE
             }
            }
          })}
          onOptionsChange={(options) => {
            const contentTypes = options.map(option => option.value) as ContentType[];
            setContentTypes(contentTypes);
          }}
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center">
          <Select
            className="w-[60%]"
            id="filters-sort-by" label="Order By"
            options={orderByOptions}
            currentOption={orderByOption}
            onOptionChange={(option) => {setOrderBy(option.value as OrderBy)}}
          />
          <Select
            className="w-[40%] ml-2"
            id="filters-order-direction" label="Order Direction"
            options={orderDirectionOptions}
            currentOption={orderDirectionOption}
            onOptionChange={(option) => {setOrderDirection(option.value as OrderDirection)}}
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
        <Popover.Button
          as={Button}
          styling="secondary" type="button" className="mr-2"
          onClick={() => {dispatch(resetListFilters())}}
        >Clear</Popover.Button>
        <Popover.Button
          as={Button}
          type="submit"
        >Apply</Popover.Button>
      </div>
    </form>
  )
}


export function ContentListFilterIconAndPopup() {
  const filters = useSelector(selectListFilters);
  const filtersAreActive = JSON.stringify(filters) !== JSON.stringify(defaultListFilters)

  return (
    <ContentWithPopup
      label="Open Filter Menu"
      content={
        <button
          className={classNames(
            "p-1 flex items-center",
            "text-br-whiteGrey-50 hover:text-br-teal-600"
          )}
          aria-label="Open Filter Menu"
        >
          {filtersAreActive && <i className="h-[10px] w-[10px] rounded-full bg-br-teal-600 mr-1"></i>}
          <span className="mr-1 font-bold underline underline-offset-4">Filters</span>
          <Filter size={iconSizes.small} />
        </button>
      }
      popupContent={
        <div className="p-2 maw-w-[350px]">
          <ListFilterForm onClose={() => {}} />
        </div>
      }
    />
  )
}