import {useSelector} from "react-redux";
import {selectDeleteContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeDeleteContentModal} from "../../../state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {deleteNote} from "../../../state/features/current-vault/notes/notes-actions";
import {deleteNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-actions";
import {Modal} from "./modal";
import {deleteTaskList} from "../../../state/features/current-vault/task-lists/task-lists-actions";

export function DeleteModal() {
  const dispatch = useAppDispatch();
  const deleteModal = useSelector(selectDeleteContentModal);
  const closeModal = () => {dispatch(closeDeleteContentModal())};

  let contentType;
  switch (deleteModal.content?.type) {
    case ContentType.TASK_LIST: {
      contentType = "task list"
      break;
    }
    case ContentType.NOTE_TEMPLATE: {
      contentType = "note template"
      break ;
    }
    default: {
      contentType = "note"
      break;
    }
  }

  return (
    <Modal
      heading={`Delete '${deleteModal.content?.data.name}' ${contentType}`}
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
                  dispatch(deleteNote(deleteModal.content.data.id));
                }
                else if (deleteModal.content?.type === ContentType.NOTE_TEMPLATE) {
                  dispatch(deleteNoteTemplate(deleteModal.content.data.id));
                }
                else if (deleteModal.content?.type === ContentType.TASK_LIST) {
                  dispatch(deleteTaskList(deleteModal.content.data.id));
                }
                closeModal();
              }}>Delete</Button>
          </div>
        </>
      }
    />
  )
}
