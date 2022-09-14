import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import React from "react";
import {IconWithMenuPopup, MenuItem} from "./icon-with-menu-popup";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";
import {useAppDispatch} from "../../../main/state/store";
import {openDeleteContentModal, openRenameContentModal} from "../../../main/state/features/ui/modals/modals-actions";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {createNoteFromTemplate} from "../../../main/state/features/open-vault/notes/notes-thunks";

export interface ContentActionsIconAndPopupProps {
  content: ContentData
}

export function ContentActionsIconAndPopup(props: ContentActionsIconAndPopupProps) {
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
  if (props.content.type === ContentType.TEMPLATE) {
    menuItems.unshift({
      label: "Create Note",
      action: () => {
        // todo: fix types issue with thunk dispatch
        // @ts-ignore
        dispatch(createNoteFromTemplate(props.content.data.id));
      }
    })
  }

  return (
    <IconWithMenuPopup
      label="Note Actions"
      icon={
        <FileTabOptionsIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      menuItems={menuItems}
    />
  )
}
