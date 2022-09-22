import React from "react";

import {useAppDispatch} from "../../../state/store";
import {MenuPopup} from "./menu-popup";
import {Folder} from "../../../state/features/current-vault/folders/folders-interface";
import {
  openCreateContentModal,
  openCreateFolderModal,
  openDeleteFolderModal,
  openMoveFolderModal,
  openRenameFolderModal
} from "../../../state/features/ui/modals/modals-actions";
import {ContentType} from "../../../state/features/ui/content/content-interface";

export interface FolderActionsMenuProps {
  folder: Folder
}

export function FolderActionsMenu(props: FolderActionsMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "New Folder",
      action: () => {
        dispatch(openCreateFolderModal(props.folder.id))
      }
    },
    {
      label: "Rename",
      action: () => {
        dispatch(openRenameFolderModal(props.folder))
      }
    },
    {
      label: "Move",
      action: () => {
        dispatch(openMoveFolderModal(props.folder))
      }
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteFolderModal(props.folder))
      }
    },
    {
      label: "New Note",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE,
          targetFolderId: props.folder.id
        }))
      }
    },
    {
      label: "New Note Template",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE_TEMPLATE,
          targetFolderId: props.folder.id
        }))
      }
    },
    {
      label: "New Task List",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.TASK_LIST,
          targetFolderId: props.folder.id
        }))
      }
    },
  ];

  return (
    <MenuPopup
        menuItems={menuItems}
        onClose={() => {
          //Visibility is handled by the popup functionality, so no on close function is required.
        }}
    />
  )
}

export function RootFolderActionsMenu() {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "New Folder",
      action: () => {
        dispatch(openCreateFolderModal(null))
      }
    },
    {
      label: "New Note",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE,
          targetFolderId: null
        }))
      }
    },
    {
      label: "New Note Template",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE,
          targetFolderId: null
        }))
      }
    },
    {
      label: "New Task List",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE,
          targetFolderId: null
        }))
      }
    },
  ];

  return (
    <MenuPopup
        menuItems={menuItems}
        onClose={() => {
          //Visibility is handled by the popup functionality, so no on close function is required.
        }}
    />
  )
}
