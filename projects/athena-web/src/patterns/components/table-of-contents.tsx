import {ContentData} from "../../state/features/ui/content/content-selctors";
import {ContentWithPopup} from "./popup-menus/content-with-popup";
import React from "react";
import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {ListOrdered as HeadingIcon} from "lucide-react";
import {PopupPanel} from "./popup-panel/popup-panel";

export interface TableOfContentsProps {
  content: ContentData
}

export function TableOfContents(props: TableOfContentsProps) {
  return (
    <ContentWithPopup
      className="mr-3"
      label="History"
      content={
        <HeadingIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>
      }
      popupContent={
        <PopupPanel
          className="p-2"
        >
          <p className="text-br-whiteGrey-100">Headings Here</p>
        </PopupPanel>
      }
    />
  )
}