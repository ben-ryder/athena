import React from "react";

import {useAppDispatch} from "../../../state/store";
import {MenuPopup} from "./menu-popup";
import {Folder} from "../../../state/features/current-vault/folders/folders-interface";

export interface FolderActionsMenuProps {
  folder: Folder
}

export function FolderActionsMenu(props: FolderActionsMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "New Folder",
      action: () => {}
    },
    {
      label: "Rename",
      action: () => {}
    },
    {
      label: "Move",
      action: () => {}
    },
    {
      label: "Delete",
      action: () => {}
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} />
  )
}

export function RootFolderActionsMenu() {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "New Folder",
      action: () => {}
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} />
  )
}
