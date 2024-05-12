import React from "react";
import { JButton, JDialog } from "@ben-ryder/jigsaw-react";
import {createModalContext} from "../../../common/dialog/generic-dialog";

import "./views-dialog.scss"
import {useWorkspaceContext} from "../../workspace/workspace-context";

export const {
  context: ViewsDialogContext,
  useContext: useViewsDialog,
  provider: ViewsDialogProvider
} = createModalContext()

export function ViewsDialog() {
  const {isOpen, setIsOpen} = useViewsDialog()
  const { openTab } = useWorkspaceContext()

  return (
    <JDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Views"
      description="View and manage your views"
      content={
        <div className='views-dialog'>
          <div className='views-dialog__header'>
            <JButton
              className='views-dialog__create'
              onClick={() => {
                openTab({ type: 'view_new' }, { switch: true })
                setIsOpen(false)
              }}
            >New View
            </JButton>
          </div>
          <div className='views-dialog__content'>
          </div>
        </div>
      }
    />
  )
}
