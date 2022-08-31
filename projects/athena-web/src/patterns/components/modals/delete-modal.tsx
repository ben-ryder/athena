import {useSelector} from "react-redux";
import {selectDeleteModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeDeleteModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {deleteNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {deleteTemplate} from "../../../main/state/features/open-vault/templates/templates-actions";
import {Modal} from "./modal";

export function DeleteModal() {
  const dispatch = useAppDispatch();
  const deleteModal = useSelector(selectDeleteModal);
  const closeModal = () => {dispatch(closeDeleteModal())};

  return (
    <Modal
      heading={`Delete ${deleteModal.content?.data.name}`}
      isOpen={deleteModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-200">This will permanently delete <b>{deleteModal.content?.data.name}</b>. Are you sure?</p>

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" onClick={closeModal}>Cancel</Button>
            <Button
              styling="destructive"
              className="ml-2"
              onClick={() => {
                if (deleteModal.content?.type === ContentType.NOTE) {
                  dispatch(deleteNote({
                    id: deleteModal.content.data.id
                  }))
                }
                else if (deleteModal.content?.type === ContentType.TEMPLATE) {
                  dispatch(deleteTemplate({
                    id: deleteModal.content.data.id
                  }))
                }
                else if (deleteModal.content?.type === ContentType.TASK_LIST) {
                  console.log("delete task list");
                }
                closeModal();
              }}>Delete</Button>
          </div>
        </>
      }
    />
  )
}
