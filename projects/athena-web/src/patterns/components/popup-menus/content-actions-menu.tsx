import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import React from "react";
import {IconWithMenuPopup} from "./icon-with-popup";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";
import {useAppDispatch} from "../../../main/state/store";
import {openDeleteModal, openRenameModal} from "../../../main/state/features/ui/modals/modals-actions";

export interface ContentActionsIconAndPopupProps {
  content: ContentData
}

export function ContentActionsIconAndPopup(props: ContentActionsIconAndPopupProps) {
  const dispatch = useAppDispatch();

  return (
    <IconWithMenuPopup
      label="Note Actions"
      icon={
        <FileTabOptionsIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      menuItems={[
        {
          label: "Rename",
          action: () => {
            dispatch(openRenameModal(props.content))
          }
        },
        {
          label: "Delete",
          action: () => {
            dispatch(openDeleteModal(props.content))
          }
        }
      ]}
    />
  )
}
