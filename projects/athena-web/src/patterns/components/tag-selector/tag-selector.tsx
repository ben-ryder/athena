import React, {forwardRef, Fragment, useState} from 'react';
import classNames from "classnames";
import { Combobox } from '@headlessui/react';
import {X as XIcon} from "lucide-react";
import {
  colourPalette, ErrorText,
  getOptionLookup,
  IconButton,
  iconColorClassNames,
  iconSizes,
  Label,
  MultiSelectProps,
  Tag
} from "@ben-ryder/jigsaw";
import {SelectContainer} from "@ben-ryder/jigsaw/dist/patterns/02-partials/select/select-container";
import { Float } from '@headlessui-float/react';

export const TagSelector = forwardRef<HTMLSelectElement, MultiSelectProps>((props, ref) => {
  const [query, setQuery] = useState<string>("");
  const optionLookup = getOptionLookup(props.options, props.currentOptions);

  const filteredOptions = props.options
    .filter((option) => {
      if (!option.name.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }

      for (const currentOption of props.currentOptions) {
        if (currentOption === option.value) {
          return false;
        }
      }

      return true;
    })

  return (
    <Combobox value={props.currentOptions} onChange={props.onOptionsChange} multiple={true}>
      <Combobox.Label as={Fragment}>
        <Label isHidden={true}>Content Tags</Label>
      </Combobox.Label>
      <Float placement="top-start" offset={4} zIndex={30} flip={false}>
        {/** Selected Tags Input & Display **/}
        <div
          className={classNames(
            "relative block w-full outline-none text-br-whiteGrey-200 overflow-x-scroll"
          )}
        >
          <div className="flex items-center p-1.5 gap-1.5">
            {props.currentOptions.map(option => (
              <Tag
                key={option}
                text={optionLookup[option].name}
                backgroundColour={optionLookup[option].backgroundColour}
                textColour={optionLookup[option].textColour}
                rightContent={
                  <IconButton
                    label={`Unselect ${optionLookup[option]}`}
                    icon={
                      <XIcon
                        size={iconSizes.small}
                        style={{
                          stroke: optionLookup[option].textColour || colourPalette.whiteGrey["50"],
                          fill: optionLookup[option].textColour || colourPalette.whiteGrey["50"]
                        }}
                      />
                    }
                    className={iconColorClassNames.secondary}
                    onClick={(event) => {
                      event.stopPropagation()
                      event.preventDefault()
                      props.onOptionsChange(props.currentOptions.filter((filterOption) => filterOption !== option))
                    }}
                  />
                }
              />
            ))}
            <Combobox.Input
              type="text"
              onChange={(event) => {setQuery(event.target.value)}}
              placeholder="search tags..."
              className="py-0.5 px-1.5 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
        </div>
        {/** Select Tag Popup **/}
        <Combobox.Options
          as={Fragment}
        >
          <div className="w-full rounded-md shadow-md rounded bg-br-atom-600 border border-br-blueGrey-700 ml-2">
            <div className="flex flex-wrap gap-2 p-2">
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  as={Fragment}
                >
                  {({active}) =>
                    <button
                      className={classNames(
                        "py-0.5 px-1 rounded font-sm", // styles copied from Tag element
                        {
                          "underline": active
                        }
                      )}
                      style={{
                        backgroundColor: option.backgroundColour || colourPalette.teal["600"],
                        color: option.textColour || colourPalette.whiteGrey["50"]
                      }}
                    >
                      {option.name}
                    </button>
                  }
                </Combobox.Option>
              ))}
              {filteredOptions.length === 0 &&
                  <p className="text-br-whiteGrey-100">No Tags Found</p>
              }
            </div>
          </div>
        </Combobox.Options>
      </Float>
    </Combobox>
  )
});
