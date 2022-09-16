import {useSelector} from "react-redux";
import {selectCreateContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeCreateContentModal} from "../../../state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useState} from "react";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {Modal} from "./modal";
import {createNewNote} from "../../../state/features/open-vault/notes/notes-thunks";
import {createNewTemplate} from "../../../state/features/open-vault/templates/templates-thunks";
import {createNewTaskList} from "../../../state/features/open-vault/task-lists/task-lists-thunks";

export function CreateModal() {
  const dispatch = useAppDispatch();
  const createModal = useSelector(selectCreateContentModal);
  const closeModal = () => {dispatch(closeCreateContentModal())};
  const [name, setName] = useState<string>("");

  let contentType;
  if (createModal.type === ContentType.NOTE) {
    contentType = "Note"
  }
  else if (createModal.type === ContentType.TEMPLATE) {
    contentType = "Template"
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
              dispatch(createNewNote(name));
            }
            else if (createModal.type === ContentType.TEMPLATE) {
              dispatch(createNewTemplate(name));
            }
            else if (createModal.type === ContentType.TASK_LIST) {
              dispatch(createNewTaskList(name));
            }

            // Reset name so it won't persist on next use of the modal.
            setName("");
            closeModal();
          }}
        >
          <Input
            value={name} onChange={(e) => {setName(e.target.value)}}
            id="name" label={`${contentType} Name`} type="text"
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