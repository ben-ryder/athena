import React from "react";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {formatUTCString} from "../../../helpers/format-utc-string";

export interface ContentDetailsProps {
  content: ContentData
}

export function ContentDetails(props: ContentDetailsProps) {
  let details;
  if (props.content.type === ContentType.TASK_LIST) {
    details = (
      <p className="text-br-whiteGrey-700 text-center italic">0 open tasks | 0 complete tasks</p>
    )
  }
  else {
    const wordCount = props.content.data.body
      .split(" ")
      .filter(word => word !== "")
      .length;
    const charCount = props.content.data.body.length;
    details = (
      <div>
        <p className="text-br-whiteGrey-700 text-center italic">{wordCount} words | {charCount} chars</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-scroll whitespace-nowrap">
      {details}
    </div>
  )
}