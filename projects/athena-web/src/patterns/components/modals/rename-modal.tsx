import { Dialog } from "@headlessui/react";
import {useSelector} from "react-redux";
import {selectRenameModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeRenameModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";

export function RenameModal() {
  const dispatch = useAppDispatch();
  const renameModal = useSelector(selectRenameModal);

  const closeModal = () => {dispatch(closeRenameModal())};

  return (
    <Dialog
      open={renameModal.isOpen}
      onClose={closeModal}>

      <Dialog.Panel
        className="absolute left-0 top-0 min-w-[100vw] min-h-[100vh] bg-br-blackGrey-900/30 z-30 flex items-center justify-center"
      >

        <div className="bg-br-atom-500 m-2 w-[500px] h-[200px]">
          <Dialog.Title>Rename {renameModal.content?.data.name}</Dialog.Title>

          <Button onClick={closeModal}>Save</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}