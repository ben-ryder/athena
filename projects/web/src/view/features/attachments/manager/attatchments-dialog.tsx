import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Paperclip as AttachmentsIcon } from "lucide-react";
import { AttachmentsManagerPage } from "./attachments-manager";

export function AttachmentsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><AttachmentsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Manage Attachements"
      description="Manage item attachments"
      content={
        <AttachmentsManagerPage />
      }
      maxWidth="1000px"
    />
  )
}
