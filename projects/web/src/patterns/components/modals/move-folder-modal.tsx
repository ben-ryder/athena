import {useSelector} from "react-redux";
import {selectMoveFolderModal} from "../../../state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../state/store";
import {closeMoveFolderModal} from "../../../state/features/ui/modals/modals-actions";
import {Modal} from "./modal";
import {MoveFolderView} from "../move-folder-view";
import {moveFolder} from "../../../state/features/current-vault/folders/folders-thunks";


export function MoveFolderModal() {
  const dispatch = useAppDispatch();
  const moveModal = useSelector(selectMoveFolderModal);
  const closeModal = () => {dispatch(closeMoveFolderModal())};

  function onFolderSelect(destinationFolderId: string | null) {
    if (moveModal.folder) {
      // @ts-ignore
      dispatch(moveFolder(moveModal.folder.id, destinationFolderId));
    }
    closeModal();
  }

  return (
    <Modal
      heading={`Move '${moveModal.folder?.name}' folder`}
      isOpen={moveModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-100">Select the folder to move <span className="font-bold">{moveModal.folder?.name}</span> to:</p>

          <div className="mt-4">
            <MoveFolderView onFolderSelect={onFolderSelect} />
          </div>
        </>
      }
    />
  )
}
