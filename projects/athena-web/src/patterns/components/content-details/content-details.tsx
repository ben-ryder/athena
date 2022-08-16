import React from "react";

export interface ContentDetailsProps {
  text: string
}

export function ContentDetails(props: ContentDetailsProps) {
  const wordCount = props.text.split(" ").length;
  const charCount = props.text.length;

  return (
    <p className="text-br-whiteGrey-700 text-center italic">{wordCount} words | {charCount} chars</p>
  )
}