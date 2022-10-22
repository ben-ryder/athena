import React from "react";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {useAppDispatch} from "../../../state/store";
import {
  openDeleteContentModal,
  openMoveContentModal,
  openNoteTemplateFolderModal,
  openRenameContentModal
} from "../../../state/features/ui/modals/modals-actions";
import {MenuPopup} from "./menu-popup";
import {ContentType} from "../../../state/features/ui/content/content-interface";

export interface ContentActionMenuProps {
  content: ContentData,
  onClose: () => void
}

export function ContentActionMenu(props: ContentActionMenuProps) {
  if (props.content.type === ContentType.NOTE) {
    return <NoteActionMenu content={props.content} onClose={props.onClose} />
  }
  else if (props.content.type === ContentType.TASK_LIST) {
    return <TaskListActionMenu content={props.content} onClose={props.onClose}/>
  }
  else {
    return <TemplateActionMenu content={props.content} onClose={props.onClose}/>
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
      action: () => {
        dispatch(openMoveContentModal(props.content))
      }
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} onClose={props.onClose} className="max-w-[160px]" />
  )
}

export function TemplateActionMenu(props: ContentActionMenuProps) {
  const dispatch = useAppDispatch();

  let menuItems = [
    {
      label: "New Note",
      action: () => {
        // todo: fix types issue with thunk dispatch
        // @ts-ignore
        dispatch(createNoteFromTemplate(props.content.data.id));
      }
    },
    {
      label: "Set Target Folder",
      action: () => {
        // todo: update typings to stop this check being required
        if (props.content.type === ContentType.NOTE_TEMPLATE) {
          dispatch(openNoteTemplateFolderModal(props.content.data))
        }
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
      action: () => {
        dispatch(openMoveContentModal(props.content))
      }
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} onClose={props.onClose} className="max-w-[160px]" />
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
      action: () => {
        dispatch(openMoveContentModal(props.content))
      }
    },
    {
      label: "Delete",
      action: () => {
        dispatch(openDeleteContentModal(props.content))
      }
    }
  ];

  return (
    <MenuPopup menuItems={menuItems} onClose={props.onClose} className="max-w-[160px]" />
  )
}
