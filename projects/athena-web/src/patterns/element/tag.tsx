import React from 'react';
import classNames from "classnames";

import {StrictReactNode} from "@ben-ryder/jigsaw";

export interface TagsProps {
  text: string,
  bgColor?: string,
  fgColor?: string,
  rightContent?: StrictReactNode,
  className?: string
}

export function Tag(props: TagsProps) {
  const className = classNames(
    "block rounded font-sm",
    {
      "bg-br-teal-600 text-br-whiteGrey-50" : !props.bgColor && !props.fgColor
    },
    props.className
  )

  let style = {};
  if (props.bgColor && props.fgColor) {
    style = {
      backgroundColor: props.bgColor,
      color: props.fgColor
    }
  }

  return (
    <div className={className} style={style}>
      <span className="flex justify-center items-center px-1 py-0.5">
        <span className={classNames("whitespace-nowrap", {"mx-[5px]": props.rightContent})}>
          {props.text}
        </span>
        {props.rightContent && props.rightContent}
      </span>
    </div>
  )
}
