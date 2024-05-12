import React from "react";
import { JDialog } from "@ben-ryder/jigsaw-react";
import {Search} from "../search";
import {createModalContext} from "../../../common/dialog/generic-dialog";

import "./search-dialog.scss"
import {useWorkspaceContext} from "../../workspace/workspace-context";

export const {
  context: SearchDialogContext,
  useContext: useSearchDialog,
  provider: SearchDialogProvider
} = createModalContext()

export function SearchDialog() {
  const {isOpen, setIsOpen} = useSearchDialog()
  const { openTab } = useWorkspaceContext()

  return (
    <JDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Search your content"
      description="Search for your content, view favorites and actions"
      content={
        <div className='search-dialog'>
          <div className='search-dialog__header'>
            <button
              className='search-dialog__tab-open'
              onClick={() => {
                openTab({type: 'search'}, {switch: true})
                setIsOpen(false)
              }}
            >Open search tab
            </button>
          </div>
          <div className='search-dialog__content'>
            <Search onOpen={() => {
              setIsOpen(false)
            }}/>
          </div>
        </div>
      }
    />
  )
}
