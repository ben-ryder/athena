import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {Plus as AddContentIcon} from "lucide-react";
import React from "react";
import {useAppDispatch} from "../../../state/store";
import {openCreateContentModal} from "../../../state/features/ui/modals/modals-actions";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {ContentWithPopup} from "./content-with-popup";
import {MenuPopup} from "./menu-popup";

export function CreateContentIconAndPopup() {
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      label: "Note",
      action: () => {
        dispatch(openCreateContentModal(ContentType.NOTE));
      }
    },
    {
      label: "Note Template",
      action: () => {
        dispatch(openCreateContentModal(ContentType.NOTE_TEMPLATE));
      }
    },
    {
      label: "Task List",
      action: () => {
        dispatch(openCreateContentModal(ContentType.TASK_LIST));
      }
    }
  ];

  return (
    <ContentWithPopup
      label="Create Content"
      content={
        <AddContentIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      popupContent={
        <MenuPopup
          menuItems={menuItems}
        />
      }
    />
  )
}
