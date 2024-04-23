import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Search as SearchIcon } from "lucide-react";
import {Search} from "../workspace/search/search";
import {useWorkspaceContext} from "../workspace/workspace-context";

import "./search-dialog.scss"

export function SearchDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const {openTab} = useWorkspaceContext()

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><SearchIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Search your content"
      description="Search for your content, view favorites and actions"
      content={
        <div className='search-dialog'>
          <div className='search-dialog__header'>
            <button
              className='search-dialog__tab-open'
              onClick={() => {
                openTab({type: 'search'}, {switch: true})
                setOpen(false)
              }}
            >Open search tab</button>
          </div>
          <div className='search-dialog__content'>
            <Search onOpen={() => {
              setOpen(false)
            }}/>
          </div>
        </div>
      }
    />
  )
}
