import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Filter as ViewsIcon } from "lucide-react";

export function ViewsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><ViewsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Manage Views"
      description="Open and manage views"
      content={
        <p>Open and manage views</p>
      }
    />
  )
}
