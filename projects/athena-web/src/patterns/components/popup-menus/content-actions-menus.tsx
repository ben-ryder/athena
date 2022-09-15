import React from "react";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";
import {useAppDispatch} from "../../../main/state/store";
import {openDeleteContentModal, openRenameContentModal} from "../../../main/state/features/ui/modals/modals-actions";
import {createNoteFromTemplate} from "../../../main/state/features/open-vault/notes/notes-thunks";
import {MenuPopup} from "./menu-popup";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";

export interface ContentActionMenuProps {
  content: ContentData
}

export function ContentActionMenu(props: ContentActionMenuProps) {
  if (props.content.type === ContentType.NOTE) {
    return <NoteActionMenu content={props.content} />
  }
  else if (props.content.type === ContentType.TASK_LIST) {
    return <TaskListActionMenu content={props.content} />
  }
  else {
    return <TemplateActionMenu content={props.content} />
  }
}

export function NoteActionMenu(props: ContentActionMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "Rename",
      action: () => {
        dispatch(openRenameContentModal(props.content))
      }
    },
    {
      label: "Move",
      action: () => {}
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} />
  )
}

export function TemplateActionMenu(props: ContentActionMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "Create Note",
      action: () => {
        // todo: fix types issue with thunk dispatch
        // @ts-ignore
        dispatch(createNoteFromTemplate(props.content.data.id));
      }
    },
    {
      label: "Rename",
      action: () => {
        dispatch(openRenameContentModal(props.content))
      }
    },
    {
      label: "Move",
      action: () => {}
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} />
  )
}

export function TaskListActionMenu(props: ContentActionMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "Rename",
      action: () => {
        dispatch(openRenameContentModal(props.content))
      }
    },
    {
      label: "Move",
      action: () => {}
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} />
  )
}
