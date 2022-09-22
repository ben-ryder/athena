import {ContentData} from "../../state/features/ui/content/content-selctors";
import {ContentWithPopup} from "./popup-menus/content-with-popup";
import React from "react";
import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {History as HistoryIcon} from "lucide-react";
import {PopupPanel} from "./popup-panel/popup-panel";
import {formatUTCString} from "../../helpers/format-utc-string";

export interface ContentHistoryProps {
  content: ContentData
}

export function ContentHistory(props: ContentHistoryProps) {
  const createdDate = formatUTCString(props.content.data.createdAt);
  const updatedDate = formatUTCString(props.content.data.updatedAt);

  return (
    <ContentWithPopup
      label="History"
      content={
        <HistoryIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>
      }
      popupContent={
        <PopupPanel
          className="p-2"
        >
          <p className="text-br-whiteGrey-100"><span className="font-bold">created:</span> {createdDate}</p>
          <p className="text-br-whiteGrey-100"><span className="font-bold">updated:</span> {updatedDate}</p>
        </PopupPanel>
      }
    />
  )
}