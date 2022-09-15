import {useSelector} from "react-redux";
import {selectDeleteTagModal} from "../../../main/state/features/ui/modals/modals-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {closeDeleteTagModal} from "../../../main/state/features/ui/modals/modals-actions";
import {Button} from "@ben-ryder/jigsaw";
import {Modal} from "./modal";
import {deleteTag} from "../../../main/state/features/open-vault/tags/tags-actions";


export function DeleteTagModal() {
  const dispatch = useAppDispatch();
  const deleteTagModal = useSelector(selectDeleteTagModal);
  const closeModal = () => {dispatch(closeDeleteTagModal())};

  return (
    <Modal
      heading={`Delete '${deleteTagModal.tag?.name}' tag`}
      isOpen={deleteTagModal.isOpen}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-200">This will permanently delete tag <b>{deleteTagModal.tag?.name}</b> and remove it from all content. Are you sure?</p>

          <div className="mt-4 flex justify-end items-center">
            <Button styling="secondary" onClick={closeModal}>Cancel</Button>
            <Button
              styling="destructive"
              className="ml-2"
              onClick={() => {
                if (deleteTagModal.tag) {
                  dispatch(deleteTag(deleteTagModal.tag.id));
                }
                closeModal();
              }}>Delete</Button>
          </div>
        </>
      }
    />
  )
}
