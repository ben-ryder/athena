import {useSelector} from "react-redux";
import {selectMoveContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeMoveContentModal} from "../../../state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {deleteNote} from "../../../state/features/current-vault/notes/notes-actions";
import {deleteNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-actions";
import {Modal} from "./modal";
import {deleteTaskList} from "../../../state/features/current-vault/task-lists/task-lists-actions";

export function MoveModal() {
  const dispatch = useAppDispatch();
  const deleteModal = useSelector(selectMoveContentModal);
  const closeModal = () => {dispatch(closeMoveContentModal())};

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
      heading={`Move '${deleteModal.content?.data.name}' ${contentType}`}
      isOpen={deleteModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-100">Select the folder to move <span className="font-bold">{deleteModal.content?.data.name}</span> to:</p>
        </>
      }
    />
  )
}
