import {Popover} from "@headlessui/react";
import {StrictReactNode} from "@ben-ryder/jigsaw";
import React from "react";
import { Float } from '@headlessui-float/react'

export interface MenuItem {
  label: string,
  action: () => void
}

export interface IconWithMenuPopupProps {
  label: string,
  icon: StrictReactNode,
  menuItems: MenuItem[]
}

export function IconWithMenuPopup(props: IconWithMenuPopupProps) {
  return (
    <Popover className="flex">
      <Float placement="bottom-start" offset={4} zIndex={20} flip={true}>
        <Popover.Button
          aria-label={props.label}
        >
          {props.icon}
        </Popover.Button>

        <Popover.Panel
          className="shadow-md rounded bg-br-atom-600 border border-br-blueGrey-700"
        >
          {({ close }) => (
            <>
              {props.menuItems.map(item =>
                <button
                  key={item.label}
                  onClick={() => {
                    item.action()
                    close()
                  }}
                  className="whitespace-nowrap p-1 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
                >{item.label}</button>
              )}
            </>
          )}
        </Popover.Panel>
      </Float>
    </Popover>
  )
}
