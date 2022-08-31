import {Dialog} from "@headlessui/react";
import {StrictReactNode} from "@ben-ryder/jigsaw";
import classNames from "classnames";
export interface ModalProps {
  heading: string,
  isOpen: boolean,
  onClose: () => void,
  content: StrictReactNode
}

export function Modal(props: ModalProps) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}>

      <Dialog.Panel
        className="absolute left-0 top-0 min-w-[100vw] min-h-[100vh] bg-br-blackGrey-900/40 z-30 flex items-center justify-center"
      >
        <div className={classNames(
          "bg-br-atom-500 m-4 p-4",
          "w-full max-w-[400px]"
        )}>
          <Dialog.Title className="text-br-whiteGrey-100 font-bold text-xl">{props.heading}</Dialog.Title>

          <div className="mt-4">
            {props.content}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}