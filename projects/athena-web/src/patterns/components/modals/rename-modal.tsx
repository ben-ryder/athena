import {useSelector} from "react-redux";
import {selectRenameContentModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeRenameContentModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useEffect, useRef, useState} from "react";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {renameNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {renameTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";
import {Modal} from "./modal";
import {renameTaskList} from "../../../main/state/features/open-vault/task-lists/task-lists-actions";

export function RenameModal() {
  const dispatch = useAppDispatch();
  const renameModal = useSelector(selectRenameContentModal);
  const closeModal = () => {dispatch(closeRenameContentModal())};

  const [newName, setNewName] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  let contentType;
  switch (renameModal.content?.type) {
    case ContentType.TASK_LIST: {
      contentType = "task list"
      break;
    }
    case ContentType.TEMPLATE: {
      contentType = "template"
      break ;
    }
    default: {
      contentType = "note"
      break;
    }
  }

  useEffect(() => {
    setNewName(renameModal.content?.data.name || "");

    // todo: fix/refine the select functionality to work better, it's not that reliable.
    // maybe this could mean rendering the modal "in line" when required, rather than all the time? That could then also
    // fix the tab order getting borked.

    // A bit of a hack to get the input text to stay selected after the newName state is updated.
    setTimeout(() => {
      if (ref.current) {
        ref.current.select()
      }
    }, 5);
  }, [renameModal])

  return (
    <Modal
      heading={`Rename '${renameModal.content?.data.name}' ${contentType}`}
      isOpen={renameModal.isOpen}
      onClose={closeModal}
      content={
        <form
          onSubmit={() => {
            if (renameModal.content?.type === ContentType.NOTE) {
              dispatch(renameNote({
                id: renameModal.content.data.id,
                name: newName
              }))
            }
            else if (renameModal.content?.type === ContentType.TEMPLATE) {
              dispatch(renameTemplate({
                id: renameModal.content.data.id,
                name: newName
              }))
            }
            else if (renameModal.content?.type === ContentType.TASK_LIST) {
              dispatch(renameTaskList({
                id: renameModal.content.data.id,
                name: newName
              }))
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