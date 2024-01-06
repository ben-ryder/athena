import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { LayoutTemplate as PagesIcon } from "lucide-react";

export function PagesDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><PagesIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Pages"
      description="Open and manage pages"
      content={
        <p>Open and manage pages</p>
      }
    />
  )
}
