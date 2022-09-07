import {ContentWithPopup} from "./content-with-popup";
import classNames from "classnames";
import {Filter} from "lucide-react";
import {Button, iconSizes, Input, MultiSelect, Select} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {useAppDispatch} from "../../../main/state/store";
import {useSelector} from "react-redux";
import {selectTagsListFilters} from "../../../main/state/features/ui/view/view-selectors";
import {OrderBy, OrderDirection} from "../../../main/state/features/open-vault/open-vault-interfaces";
import {
  resetTagsListFilters,
  updateTagsListFilters
} from "../../../main/state/features/ui/view/view-actions";
import { Popover } from "@headlessui/react";
import {defaultTagsListFilters} from "../../../main/state/features/ui/view/view-reducer";


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
    name: "ASC",
    value: OrderDirection.ASC
  },
  {
    name: "DESC",
    value: OrderDirection.DESC
  }
];

export interface ListFilterFormProps {
  onClose: () => void
}


export function TagsListFilterForm(props: ListFilterFormProps) {
  const dispatch = useAppDispatch();
  const filters = useSelector(selectTagsListFilters);

  const [search, setSearch] = useState<string>(filters.search);
  const [orderBy, setOrderBy] = useState<OrderBy>(filters.orderBy);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(filters.orderDirection);

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
      className="p-2 w-[350px]"
      onSubmit={(e) => {
        e.preventDefault();

        props.onClose()
        dispatch(updateTagsListFilters({
          search: search,
          orderBy: orderBy,
          orderDirection: orderDirection
        }))
      }}
    >
      <div className="">
        <Input
          id="tags-list-search" label="Search" type="text" placeholder="search tags..."
          value={search} onChange={(e) => {setSearch(e.target.value)}}
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center">
          <Select
            className="w-[60%]"
            id="tags-list-sort-by" label="Order By"
            options={orderByOptions}
            currentOption={orderByOption}
            onOptionChange={(option) => {setOrderBy(option.value as OrderBy)}}
          />
          <Select
            className="w-[40%] ml-2"
            id="tags-list-order-direction" label="Order Direction"
            options={orderDirectionOptions}
            currentOption={orderDirectionOption}
            onOptionChange={(option) => {setOrderDirection(option.value as OrderDirection)}}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end items-center">
        <Popover.Button
          as={Button}
          styling="secondary" type="button" className="mr-2"
          onClick={() => {dispatch(resetTagsListFilters())}}
        >Clear</Popover.Button>
        <Popover.Button
          as={Button}
          type="submit"
        >Apply</Popover.Button>
      </div>
    </form>
  )
}


export function TagsListFilterIconAndPopup() {
  const filters = useSelector(selectTagsListFilters);
  const filtersAreActive = JSON.stringify(filters) !== JSON.stringify(defaultTagsListFilters)

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
          <TagsListFilterForm onClose={() => {}} />
        </div>
      }
    />
  )
}