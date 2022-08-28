import React from "react";
import {ContentData} from "../../../main/state/features/ui/ui-selctors";
import {ContentType} from "../../../main/state/features/ui/ui-interfaces";

export interface ContentDetailsProps {
  content: ContentData
}

export function ContentDetails(props: ContentDetailsProps) {
  if (props.content.type === ContentType.TASK_LIST) {
    return (
      <p className="text-br-whiteGrey-700 text-center italic">0 open tasks | 0 complete tasks</p>
    )
  }

  const wordCount = props.content.data.body.split(" ").length;
  const charCount = props.content.data.body.length;
  return (
    <p className="text-br-whiteGrey-700 text-center italic">{wordCount} words | {charCount} chars</p>
  )
}