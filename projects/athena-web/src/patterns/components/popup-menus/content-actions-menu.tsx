import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import React from "react";
import {IconWithMenuPopup} from "./icon-with-popup";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";

export interface ContentActionsIconAndPopupProps {
  content: ContentData
}

export function ContentActionsIconAndPopup(props: ContentActionsIconAndPopupProps) {
  return (
    <IconWithMenuPopup
      label="Note Actions"
      icon={
        <FileTabOptionsIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      menuItems={[
        {
          label: "Rename",
          action: () => {}
        },
        {
          label: "Delete",
          action: () => {}
        }
      ]}
    />
  )
}
