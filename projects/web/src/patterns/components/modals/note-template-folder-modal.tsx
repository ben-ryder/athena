import {useSelector} from "react-redux";
import {
  selectNoteTemplateFolderModal
} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeNoteTemplateFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Modal} from "./modal";
import {MoveFolderView} from "../move-folder-view";
import {
  updateNoteTemplateTargetFolder
} from "../../../state/features/current-vault/note-templates/note-templates-thunks";


export function NoteTemplateFolderModal() {
  const dispatch = useAppDispatch();
  const noteTemplateFolderModal = useSelector(selectNoteTemplateFolderModal);
  const closeModal = () => {dispatch(closeNoteTemplateFolderModal())};

  if (!noteTemplateFolderModal.noteTemplate) {
    return null;
  }

  function onFolderSelect(destinationFolderId: string | null) {
    if (noteTemplateFolderModal.noteTemplate) {
      dispatch(
        updateNoteTemplateTargetFolder(noteTemplateFolderModal.noteTemplate.id, destinationFolderId)
      )
    }

    closeModal();
  }

  return (
    <Modal
      heading={`Select '${noteTemplateFolderModal.noteTemplate?.name}' target folder`}
      isOpen={noteTemplateFolderModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-100">Select the folder where notes from the <span className="font-bold">{noteTemplateFolderModal.noteTemplate.name}</span> template will be created:</p>

          <div className="mt-4">
            <MoveFolderView onFolderSelect={onFolderSelect} />
          </div>
        </>
      }
    />
  )
}
