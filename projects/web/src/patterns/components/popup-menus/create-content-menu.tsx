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
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE,
          targetFolderId: null
        }))
      }
    },
    {
      label: "Note Template",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.NOTE_TEMPLATE,
          targetFolderId: null
        }))
      }
    },
    {
      label: "Task List",
      action: () => {
        dispatch(openCreateContentModal({
          contentType: ContentType.TASK_LIST,
          targetFolderId: null
        }))
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
          onClose={() => {
            //Visibility is handled by the popup functionality, so no on close function is required.
          }}
        />
      }
    />
  )
}
