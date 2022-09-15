import {StrictReactNode} from "@ben-ryder/jigsaw";

export interface PopupPanelProps {
  children: StrictReactNode
}

export function PopupPanel(props: PopupPanelProps) {
  return (
    <div className="shadow-md rounded bg-br-atom-600 border border-br-blueGrey-700">
      {props.children}
    </div>
  )
}
