import {useSelector} from "react-redux";
import {selectMoveContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeMoveContentModal} from "../../../state/features/ui/modals/modals-actions";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {Modal} from "./modal";
import {MoveFolderView} from "../move-folder-view";
import {moveTaskList} from "../../../state/features/current-vault/task-lists/task-lists-thunks";
import {moveNoteTemplate} from "../../../state/features/current-vault/note-templates/note-templates-thunks";
import {moveNote} from "../../../state/features/current-vault/notes/notes-thunks";


export function MoveContentModal() {
  const dispatch = useAppDispatch();
  const deleteModal = useSelector(selectMoveContentModal);
  const closeModal = () => {dispatch(closeMoveContentModal())};

  let contentType: string;
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

  function onFolderSelect(destinationFolderId: string | null) {
    console.log("move");
    switch (deleteModal.content?.type) {
      case ContentType.TASK_LIST: {
        dispatch(moveTaskList(deleteModal.content.data.id, destinationFolderId));
        break;
      }
      case ContentType.NOTE_TEMPLATE: {
        dispatch(moveNoteTemplate(deleteModal.content.data.id, destinationFolderId));
        break;
      }
      case ContentType.NOTE: {
        dispatch(moveNote(deleteModal.content.data.id, destinationFolderId));
        break;
      }
    }

    closeModal();
  }

  return (
    <Modal
      heading={`Move '${deleteModal.content?.data.name}' ${contentType}`}
      isOpen={deleteModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-100">Select the folder to move <span className="font-bold">{deleteModal.content?.data.name}</span> to:</p>

          <div className="mt-2">
            <MoveFolderView onFolderSelect={onFolderSelect} />
          </div>
        </>
      }
    />
  )
}
