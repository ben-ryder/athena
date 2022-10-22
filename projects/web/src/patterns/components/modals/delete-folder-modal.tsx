import {useSelector} from "react-redux";
import {selectDeleteFolderModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeDeleteFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {Modal} from "./modal";
import {deleteFolder} from "../../../state/features/document/folders/folders-thunks";


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
