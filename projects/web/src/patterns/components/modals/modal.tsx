import {Dialog} from "@headlessui/react";
import {IconButton, iconColorClassNames, iconSizes, StrictReactNode} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {X as CloseIcon} from "lucide-react";
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
      onClose={props.onClose}
      className="absolute left-0 top-0 min-w-[100vw] min-h-[100vh] flex justify-center items-center"
    >
      {props.isOpen &&
          <div className="absolute left-0 top-0 min-w-[100vw] min-h-[100vh] bg-br-blackGrey-900/40 z-30" />
      }
      <Dialog.Panel
        className={classNames(
          "relative bg-br-atom-500 m-4 p-4 rounded",
          "z-50 w-full max-w-[400px]"
        )}
      >
        <Dialog.Title className="text-br-whiteGrey-100 font-bold text-xl mr-10">{props.heading}</Dialog.Title>

        <div className="mt-4">
          {props.content}
        </div>

        <div className="absolute top-4 right-4">
          <IconButton
            label="Close Modal"
            icon={<CloseIcon size={iconSizes.small} className={iconColorClassNames.secondary}/>}
            onClick={props.onClose}
          />
        </div>
      </Dialog.Panel>
  </Dialog>
  )
}