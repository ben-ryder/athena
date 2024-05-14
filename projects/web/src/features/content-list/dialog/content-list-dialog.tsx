import React from "react";
import { JDialog } from "@ben-ryder/jigsaw-react";
import {createModalContext} from "../../../common/dialog/generic-dialog";

import "./content-list-dialog.scss"
import {useWorkspaceContext} from "../../workspace/workspace-context";
import {ContentList} from "../content-list";

export const {
  context: ContentListDialogContext,
  useContext: useContentListDialog,
  provider: ContentListDialogProvider
} = createModalContext()

export function ContentListDialog() {
  const {isOpen, setIsOpen} = useContentListDialog()
  const { openTab } = useWorkspaceContext()

  return (
    <JDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Search your content"
      description="Search for your content, view favorites and actions"
      content={
        <div className='content-list-dialog'>
          <div className='content-list-dialog__header'>
            <button
              className='content-list-dialog__tab-open'
              onClick={() => {
                openTab({type: 'content_list'}, {switch: true})
                setIsOpen(false)
              }}
            >Open content list tab
            </button>
          </div>
          <div className='content-list-dialog__content'>
            <ContentList onOpen={() => {
              setIsOpen(false)
            }}/>
          </div>
        </div>
      }
    />
  )
}
