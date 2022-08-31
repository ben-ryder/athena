import {StrictReactNode} from "@ben-ryder/jigsaw";
import React from "react";
import {ContentWithPopup} from "./content-with-popup";

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
    <ContentWithPopup
      label={props.label}
      content={props.icon}
      popupContent={
        <>
          {props.menuItems.map(item =>
            <button
              key={item.label}
              onClick={() => {
                item.action()
                close()
              }}
              className="whitespace-nowrap py-1 px-2 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
            >{item.label}</button>
          )}
        </>
      }
    />
  )
}
