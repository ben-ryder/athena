import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { DownloadCloud as StatusDownloadIcon } from "lucide-react";

export function LogsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-status-button">
          <JIcon size="md"><StatusDownloadIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Application Logs"
      description="View application and server logs"
      content={
        <p>View app status and logs.</p>
      }
    />
  )
}
