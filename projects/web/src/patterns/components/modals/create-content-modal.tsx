import {useSelector} from "react-redux";
import {selectCreateContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeCreateContentModal} from "../../../state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useState} from "react";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {Modal} from "./modal";
import {createNewNote} from "../../../state/features/current-vault/notes/notes-thunks";
import {createNewNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-thunks";
import {createNewTaskList} from "../../../state/features/current-vault/task-lists/task-lists-thunks";


export function CreateContentModal() {
  const dispatch = useAppDispatch();
  const createModal = useSelector(selectCreateContentModal);
  const closeModal = () => {dispatch(closeCreateContentModal())};
  const [name, setName] = useState<string>("");

  let contentType;
  if (createModal.type === ContentType.NOTE) {
    contentType = "Note"
  }
  else if (createModal.type === ContentType.NOTE_TEMPLATE) {
    contentType = "Note Template"
  }
  else if (createModal.type === ContentType.TASK_LIST) {
    contentType = "Task List"
  }

  return (
    <Modal
      heading={`Create ${contentType}`}
      isOpen={createModal.isOpen}
      onClose={closeModal}
      content={
        <form
          onSubmit={() => {
            if (createModal.type === ContentType.NOTE) {
              dispatch(createNewNote(name, createModal.targetFolderId));
            }
            else if (createModal.type === ContentType.NOTE_TEMPLATE) {
              dispatch(createNewNoteTemplate(name, createModal.targetFolderId));
            }
            else if (createModal.type === ContentType.TASK_LIST) {
              dispatch(createNewTaskList(name, createModal.targetFolderId));
            }

            // Reset name so it won't persist on next use of the modal.
            setName("");
            closeModal();
          }}
        >
          <Input
            value={name} onChange={(e) => {setName(e.target.value)}}
            id="name" label="Name" type="text"
          />

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" onClick={closeModal} type="button">Cancel</Button>
            <Button className="ml-2" type="submit">Create</Button>
          </div>
        </form>
      }
    />
  )
}
