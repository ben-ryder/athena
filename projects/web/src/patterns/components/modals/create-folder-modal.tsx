import {useSelector} from "react-redux";
import {selectCreateFolderModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeCreateFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Button, Input} from "@ben-ryder/jigsaw";
import {useState} from "react";
import {Modal} from "./modal";
import {createFolder} from "../../../state/features/database/folders/folders-thunks";


export function CreateFolderModal() {
  const dispatch = useAppDispatch();
  const createModal = useSelector(selectCreateFolderModal);
  const closeModal = () => {dispatch(closeCreateFolderModal())};
  const [name, setName] = useState<string>("");

  return (
    <Modal
      heading="Create Folder"
      isOpen={createModal.isOpen}
      onClose={closeModal}
      content={
        <form
          onSubmit={() => {
            dispatch(createFolder({
              name: name,
              parentId: createModal.targetFolderId
            }))
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
