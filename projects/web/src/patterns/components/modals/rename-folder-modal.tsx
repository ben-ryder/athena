import {useSelector} from "react-redux";
import {selectRenameFolderModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeRenameFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useEffect, useRef, useState} from "react";
import {Modal} from "./modal";
import {renameFolder} from "../../../state/features/current-vault/folders/folders-thunks";


export function RenameFolderModal() {
  const dispatch = useAppDispatch();
  const renameModal = useSelector(selectRenameFolderModal);
  const closeModal = () => {dispatch(closeRenameFolderModal())};

  const [newName, setNewName] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewName(renameModal.folder?.name || "");

    // todo: fix/refine the select functionality to work better, it's not that reliable.
    // maybe this could mean rendering the modal "in line" when required, rather than all the time? That could then also
    // fix the tab order getting borked.

    // A bit of a hack to get the input text to stay selected after the newName state is updated.
    setTimeout(() => {
      if (ref.current) {
        ref.current.select()
      }
    }, 5);
  }, [renameModal]);

  if (!renameModal.folder) {
    return null;
  }

  return (
    <Modal
      heading={`Rename '${renameModal.folder.name}' folder`}
      isOpen={renameModal.isOpen}
      onClose={closeModal}
      content={
        <form
          onSubmit={() => {
            if (renameModal.folder) {
              dispatch(renameFolder(renameModal.folder.id, newName))
            }
            closeModal();
          }}
        >
          <Input
            ref={ref}
            value={newName} onChange={(e) => {setNewName(e.target.value)}}
            id="new-name" label="New Name" type="text"
            onFocus={(e) => {
              // Automatically select all text on focus. This makes it quicker to fully override the name
              // while still allowing quick edits of the existing name if required.
              e.target.select()
            }}
          />

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" onClick={closeModal} type="button">Cancel</Button>
            <Button className="ml-2" type="submit">Save</Button>
          </div>
        </form>
      }
    />
  )
}
