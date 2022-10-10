import { StrictReactNode } from '@ben-ryder/jigsaw';
import classNames from "classnames";
import React, {forwardRef} from "react";

export interface DropdownOptionProps {
  children: StrictReactNode,
  active: boolean,
  selected: boolean
}

export const DropdownOption = forwardRef<HTMLLIElement, DropdownOptionProps>((props, ref) => {
  const {active, selected, ...passThroughProps} = props;

  return (
    <li
      ref={ref}
      className={classNames(
        "text-center py-2",
        {
          "font-semibold": props.selected,
          "cursor-pointer": props.active,
          "bg-br-teal-700 ": props.selected && props.active,
          "bg-br-teal-600": props.selected && !props.active,
          "bg-br-atom-800": props.active && !props.selected
        })}
      {...passThroughProps}
    >{props.children}</li>
  )
})