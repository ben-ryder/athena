import { StrictReactNode } from '@ben-ryder/jigsaw';
import classNames from "classnames";
import React, {forwardRef} from "react";

export interface DropdownContainerProps {
  children: StrictReactNode
}

export const DropdownContainer = forwardRef<HTMLUListElement, DropdownContainerProps>((props, ref) => {
  return (
    <ul
      ref={ref}
      className={classNames(
        "absolute mt-1 block outline-none bg-br-atom-600",
        "border border-br-blueGrey-600 text-br-whiteGrey-200",
        "flex"
      )}
      {...props}
    >{props.children}</ul>
  )
})
