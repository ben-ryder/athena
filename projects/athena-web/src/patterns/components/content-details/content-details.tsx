import React from "react";
import {ContentData} from "../../../main/state/features/ui/content/content-selctors";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {formatUTCString} from "../../../helpers/format-utc-string";

export interface ContentDetailsProps {
  content: ContentData
}

export function ContentDetails(props: ContentDetailsProps) {
  const createdDate = formatUTCString(props.content.data.createdAt);
  const updatedDate = formatUTCString(props.content.data.updatedAt);

  let details;
  if (props.content.type === ContentType.TASK_LIST) {
    details = (
      <p className="text-br-whiteGrey-700 text-center italic">0 open tasks | 0 complete tasks | created {createdDate} | updated {updatedDate}</p>
    )
  }
  else {
    const wordCount = props.content.data.body.split(" ").length;
    const charCount = props.content.data.body.length;
    details = (
      <div>
        <p className="text-br-whiteGrey-700 text-center italic">{wordCount} words | {charCount} chars | created {createdDate} | updated {updatedDate}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-scroll whitespace-nowrap">
      {details}
    </div>
  )
}