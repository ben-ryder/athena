import {ContentWithPopup} from "./content-with-popup";
import classNames from "classnames";
import {Filter} from "lucide-react";
import {Button, iconSizes, Input, MultiSelect, Select} from "@ben-ryder/jigsaw";
import React, {useState} from "react";
import {useAppDispatch} from "../../../state/store";
import {useSelector} from "react-redux";
import {selectContentListFilters} from "../../../state/features/ui/view/view-selectors";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {OrderBy, OrderDirection} from "../../../state/features/open-vault/open-vault-interfaces";
import {resetContentListFilters, updateContentListFilters} from "../../../state/features/ui/view/view-actions";
import { Popover } from "@headlessui/react";
import {defaultContentListFilters} from "../../../state/features/ui/view/view-reducer";
import {selectTagOptions} from "../../../state/features/open-vault/tags/tags-selectors";

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


export function ListFilterForm(props: ListFilterFormProps) {
  const dispatch = useAppDispatch();
  const filters = useSelector(selectContentListFilters);
  const tagOptions = useSelector(selectTagOptions);

  const [search, setSearch] = useState<string>(filters.search);
  const [contentTypes, setContentTypes] = useState<ContentType[]>(filters.contentTypes);
  const [orderBy, setOrderBy] = useState<OrderBy>(filters.orderBy);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(filters.orderDirection);
  const [tags, setTags] = useState<string[]>(filters.tags);

  return (
    <form
      className="p-2 max-w-[350px]"
      onSubmit={(e) => {
        e.preventDefault();

        props.onClose()
        dispatch(updateContentListFilters({
          search: search,
          contentTypes: contentTypes,
          orderBy: orderBy,
          orderDirection: orderDirection,
          tags: tags
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
          currentOptions={contentTypes}
          onOptionsChange={(options) => {setContentTypes(options as ContentType[]);}}
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center">
          <Select
            className="w-[60%]"
            id="filters-sort-by" label="Order By"
            options={orderByOptions}
            currentOption={orderBy}
            onOptionChange={(option) => {setOrderBy(option as OrderBy)}}
          />
          <Select
            className="w-[40%] ml-2"
            id="filters-order-direction" label="Order Direction"
            options={orderDirectionOptions}
            currentOption={orderDirection}
            onOptionChange={(option) => {setOrderDirection(option as OrderDirection)}}
          />
        </div>
      </div>

      <div className="mt-2">
        <MultiSelect
          id="filters-tags" label="Tags" placeholder="select tags..."
          options={tagOptions}
          currentOptions={tags}
          onOptionsChange={(newTags) => {setTags(newTags)}}
        />
      </div>

      <div className="mt-4 flex justify-end items-center">
        <Popover.Button
          as={Button}
          styling="secondary" type="button" className="mr-2"
          onClick={() => {dispatch(resetContentListFilters())}}
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
  const filters = useSelector(selectContentListFilters);
  const filtersAreActive = JSON.stringify(filters) !== JSON.stringify(defaultContentListFilters)

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