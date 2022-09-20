import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../state/store";
import {Button} from "@ben-ryder/jigsaw";
import {Modal} from "./modal";
import {selectApplicationError} from "../../../state/features/ui/errors/errors-selectors";
import {clearApplicationError} from "../../../state/features/ui/errors/errors-actions";


export function AppErrorModal() {
  const dispatch = useAppDispatch();
  const modalData = useSelector(selectApplicationError);
  const closeModal = () => {dispatch(clearApplicationError())};

  if (!modalData) {
    return null;
  }

  return (
    <Modal
      heading={modalData.heading}
      isOpen={true}
      onClose={closeModal}
      content={
        <>
          <p className="text-br-whiteGrey-200">{modalData.text}</p>

          <div className="mt-4 flex justify-between items-center">
            <a
              className="underline text-br-whiteGrey-100 hover:text-br-teal-600"
              href="https://github.com/Ben-Ryder/athena/issues"
              target="_blank"
            >Report Issue</a>
            <Button styling="secondary" onClick={closeModal}>Ok</Button>
          </div>
        </>
      }
    />
  )
}
