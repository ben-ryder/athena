import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Tag as TagsIcon } from "lucide-react";

export function TagsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><TagsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Manage Tags"
      description="Manage tags"
      content={
        <p>View all tags. Create, edit and delete tags.</p>
      }
    />
  )
}
