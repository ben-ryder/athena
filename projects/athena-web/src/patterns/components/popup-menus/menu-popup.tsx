import {PopupPanel} from "../popup-panel/popup-panel";
import React from "react";
import classNames from "classnames";

export interface MenuItem {
  label: string,
  action: () => void
}

export interface MenuPopupProps {
  menuItems: MenuItem[],
  onClose: () => void,
  className?: string
}

export function MenuPopup(props: MenuPopupProps) {
  return (
    <PopupPanel className={classNames(props.className)}>
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
