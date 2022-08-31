import {useSelector} from "react-redux";
import {selectCreateModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeCreateModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useState} from "react";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {createNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {createTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";
import {Modal} from "./modal";
import {v4 as createUUID} from "uuid";

export function CreateModal() {
  const dispatch = useAppDispatch();
  const createModal = useSelector(selectCreateModal);
  const closeModal = () => {dispatch(closeCreateModal())};
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
              dispatch(createNote({
                id: createUUID(),
                name: name,
                body: "",
                folderId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }));
            }
            else if (createModal.type === ContentType.TEMPLATE) {
              dispatch(createTemplate({
                id: createUUID(),
                name: name,
                body: "",
                folderId: null,
                targetFolderId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }));
            }
            else if (createModal.type === ContentType.TASK_LIST) {
              console.log("create task list");
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