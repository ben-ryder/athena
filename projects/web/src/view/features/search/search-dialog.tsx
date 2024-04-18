import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Search as SearchIcon } from "lucide-react";
import {Search} from "../workspace/search/search";

export function SearchDialog() {
  const [open, setOpen] = useState<boolean>(false)

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
        <Search onOpen={() => {setOpen(false)}} />
      }
    />
  )
}
