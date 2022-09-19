import {useSelector} from "react-redux";
import {selectDeleteContentModal, selectDeleteFolderModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeDeleteContentModal, closeDeleteFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {deleteNote} from "../../../state/features/current-vault/notes/notes-actions";
import {deleteNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-actions";
import {Modal} from "./modal";
import {deleteTaskList} from "../../../state/features/current-vault/task-lists/task-lists-actions";
import {deleteFolder} from "../../../state/features/current-vault/folders/folders-actions";


export function DeleteFolderModal() {
  const dispatch = useAppDispatch();
  const deleteModal = useSelector(selectDeleteFolderModal);
  const closeModal = () => {dispatch(closeDeleteFolderModal())};

  if (!deleteModal.folder) {
    return null;
  }

  return (
    <Modal
      heading={`Delete '${deleteModal.folder.name}' folder`}
      isOpen={deleteModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-200">Are you sure? This will permanently delete <b>{deleteModal.folder.name}</b> and all it's content.</p>

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" onClick={closeModal}>Cancel</Button>
            <Button
              styling="destructive"
              className="ml-2"
              onClick={() => {
                if (deleteModal.folder) {
                  dispatch(deleteFolder(deleteModal.folder.id));
                }
                closeModal();
              }}>Delete</Button>
          </div>
        </>
      }
    />
  )
}
