import {useSelector} from "react-redux";
import {selectMoveContentModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeMoveContentModal} from "../../../state/features/ui/modals/modals-actions";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {Modal} from "./modal";
import {MoveFolderView} from "../move-folder-view";
import {moveTaskList} from "../../../state/features/database/task-lists/task-lists-thunks";
import {moveNoteTemplate} from "../../../state/features/database/note-templates/note-templates-thunks";
import {moveNote} from "../../../state/features/database/notes/notes-thunks";


export function MoveContentModal() {
  const dispatch = useAppDispatch();
  const moveModal = useSelector(selectMoveContentModal);
  const closeModal = () => {dispatch(closeMoveContentModal())};

  let contentType: string;
  switch (moveModal.content?.type) {
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
    switch (moveModal.content?.type) {
      case ContentType.TASK_LIST: {
        dispatch(moveTaskList(moveModal.content.data.id, destinationFolderId));
        break;
      }
      case ContentType.NOTE_TEMPLATE: {
        dispatch(moveNoteTemplate(moveModal.content.data.id, destinationFolderId));
        break;
      }
      case ContentType.NOTE: {
        dispatch(moveNote(moveModal.content.data.id, destinationFolderId));
        break;
      }
    }

    closeModal();
  }

  return (
    <Modal
      heading={`Move '${moveModal.content?.data.name}' ${contentType}`}
      isOpen={moveModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-100">Select the folder to move <span className="font-bold">{moveModal.content?.data.name}</span> to:</p>

          <div className="mt-4">
            <MoveFolderView onFolderSelect={onFolderSelect} />
          </div>
        </>
      }
    />
  )
}
