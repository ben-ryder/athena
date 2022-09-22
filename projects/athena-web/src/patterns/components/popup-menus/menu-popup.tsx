import {PopupPanel} from "../popup-panel/popup-panel";
import React from "react";

export interface MenuItem {
  label: string,
  action: () => void
}

export interface MenuPopupProps {
  menuItems: MenuItem[],
  onClose: () => void
}

export function MenuPopup(props: MenuPopupProps) {
  return (
    <PopupPanel>
      {props.menuItems.map(item =>
        <button
          key={item.label}
          onClick={() => {
            item.action()
            props.onClose()
          }}
          className="whitespace-nowrap py-1 px-2 text-center w-full text-br-whiteGrey-100 hover:text-br-teal-600"
        >{item.label}</button>
      )}
    </PopupPanel>
  )
}
