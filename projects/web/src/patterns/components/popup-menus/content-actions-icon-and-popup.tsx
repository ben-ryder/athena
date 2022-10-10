import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import React from "react";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {ContentWithPopup} from "./content-with-popup";
import {ContentActionMenu} from "./content-actions-menus";

export interface ContentActionsIconAndPopupProps {
  content: ContentData
}

export function ContentActionsIconAndPopup(props: ContentActionsIconAndPopupProps) {
  return (
    <ContentWithPopup
      label="Content Actions"
      content={
        <FileTabOptionsIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary} />
      }
      popupContent={
        <ContentActionMenu
            content={props.content}
            onClose={() => {
                //Visibility is handled by the popup functionality, so no on close function is required.
            }}
        />
      }
    />
  )
}
