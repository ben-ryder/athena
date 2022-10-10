import {StrictReactNode} from "@ben-ryder/jigsaw";
import classNames from "classnames";

export interface PopupPanelProps {
  children: StrictReactNode,
  className?: string
}

export function PopupPanel(props: PopupPanelProps) {
  return (
    <div className={classNames(
      "shadow-md rounded bg-br-atom-600 border border-br-blueGrey-700",
      props.className
    )}
    >
      {props.children}
    </div>
  )
}
