import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Database as VaultIcon } from "lucide-react";

export function DatabaseDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><VaultIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Your Databases"
      description="Switch and manage your databases"
      content={
        <p>Switch current database. Create, edit and delete databases</p>
      }
    />
  )
}
