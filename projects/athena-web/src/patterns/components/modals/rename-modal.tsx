import {Dialog} from "@headlessui/react";
import {useSelector} from "react-redux";
import {selectRenameModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeRenameModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {useEffect, useRef, useState} from "react";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {renameNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {renameTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";

export function RenameModal() {
  const dispatch = useAppDispatch();
  const renameModal = useSelector(selectRenameModal);
  const closeModal = () => {dispatch(closeRenameModal())};
  const ref = useRef<HTMLInputElement>(null);

  return (
    <Dialog
      open={renameModal.isOpen}
      onClose={closeModal}>

      <Dialog.Panel
        className="absolute left-0 top-0 min-w-[100vw] min-h-[100vh] bg-br-blackGrey-900/40 z-30 flex items-center justify-center"
      >

        <div className={classNames(
          "bg-br-atom-500 m-4 p-4",
          "w-full max-w-[400px]"
        )}>
          <Dialog.Title className="text-br-whiteGrey-100 font-bold text-xl">Rename {renameModal.content?.data.name}</Dialog.Title>

          <div className="mt-4">
            <Input
              ref={ref} defaultValue={renameModal.content?.data.name || ""}
              id="new-name" label="New Name" type="text"
              onFocus={(e) => {
                // Automatically select all text on focus. This makes it quicker to fully override the name
                // while still allowing quick edits of the existing name if required.
                e.target.select()
              }}
            />

            <div className="mt-4 flex justify-end items-center">
              <Button styling="secondary" onClick={closeModal}>Cancel</Button>
              <Button className="ml-2" onClick={() => {
                if (ref.current) {
                  if (renameModal.content?.type === ContentType.NOTE) {
                    dispatch(renameNote({
                      id: renameModal.content.data.id,
                      name: ref.current.value
                    }))
                  }
                  else if (renameModal.content?.type === ContentType.TEMPLATE) {
                    dispatch(renameTemplate({
                      id: renameModal.content.data.id,
                      name: ref.current.value
                    }))
                  }
                  else if (renameModal.content?.type === ContentType.TASK_LIST) {
                    console.log("update task list title");
                  }
                }
                closeModal();
              }}>Save</Button>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}