import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { SquarePlus as NewContentIcon } from "lucide-react";
import {NewContentMenu} from "./new-content-menu";

export function NewContentDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><NewContentIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="New Content"
      description="New content"
      content={
        <NewContentMenu onOpen={() => {setOpen(false)}} />
      }
    />
  )
}
