import {StrictReactNode} from "@ben-ryder/jigsaw";

export interface FileTabSectionProps {
  children: StrictReactNode
}

export function FileTabSection(props: FileTabSectionProps) {
  return (
    <div className="h-[40px] flex bg-br-atom-800 border-b border-br-blueGrey-700">
      {props.children}
    </div>
  )
}

export function FileTabList(props: FileTabSectionProps) {
  return (
    <div className="flex overflow-x-scroll">
      {props.children}
    </div>
  )
}