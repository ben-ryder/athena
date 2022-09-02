import React, {ComponentProps, forwardRef, Fragment, useState} from 'react';
import classNames from "classnames";
import { Combobox } from '@headlessui/react';

import {X as XIcon, Tags as TagsIcon} from "lucide-react";

import {ErrorText, Label, iconColorClassNames, iconSizes, IconButton, colourPalette, Tag} from "@ben-ryder/jigsaw";

export interface TagSelectorOption {
  name: string,
  value: string,
}

export interface TagSelectorProps extends ComponentProps<'select'> {
  id: string,
  label: string,
  error?: string,
  placeholder: string,
  options: TagSelectorOption[],
  currentOptions: TagSelectorOption[],
  onOptionsChange: (options: TagSelectorOption[]) => void,
}

export const TagSelector = forwardRef<HTMLSelectElement, TagSelectorProps>((props, ref) => {
  const [query, setQuery] = useState<string>("");

  const filteredOptions =
    query === ''
      ? props.options
      : props.options.filter((option) => {
        return option.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <div className="relative">
      <Combobox value={props.currentOptions} onChange={props.onOptionsChange} multiple={true}>
        {({ open }) => (
          <>
            <Combobox.Label as={Fragment}>
              <Label isHidden={true}>{ props.label }</Label>
            </Combobox.Label>
            <>
              <div
                className={classNames(
                  "relative flex w-full outline-none p-1.5",
                  "text-br-whiteGrey-200",
                )}
              >
                <TagsIcon className="mr-2 min-w-[24px]" size={iconSizes.small} strokeWidth={1} />
                <div className="inline-flex items-center overflow-x-scroll">
                  {props.currentOptions.map(option => (
                    <Tag
                      key={option.name}
                      text={option.name}
                      rightContent={
                        <IconButton
                          label={`Unselect ${option.name}`}
                          icon={
                            <XIcon size={iconSizes.extraSmall} strokeWidth={2} />
                          }
                          className={iconColorClassNames.secondary}
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            props.onOptionsChange(props.currentOptions.filter((filterOption) => filterOption !== option))
                          }}
                        />
                      }
                      className="mr-1.5 text-sm"
                    />
                  ))}
                  <Combobox.Input
                    type="text"
                    onChange={(event) => {setQuery(event.target.value)}}
                    placeholder={props.placeholder}
                    className="p-0 bg-transparent border-none outline-none focus:ring-0"
                  />
                </div>
              </div>
              <Combobox.Options
                className={classNames(
                  "absolute mt-1 block outline-none bg-br-atom-600",
                  "border border-br-blueGrey-600 text-br-whiteGrey-200",
                  "flex p-2"
                )}
              >
                {filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    value={option}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li>
                        <Tag
                          className="text-sm ml-2"
                          text={option.name}
                          bgColor={active ? colourPalette.teal["600"] : colourPalette.blueGrey["700"]}
                          fgColor={colourPalette.whiteGrey["50"]}
                        />
                      </li>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </>
          </>
        )}
      </Combobox>
      {props.error &&
          <ErrorText>{props.error}</ErrorText>
      }
    </div>
  )
});
