import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { UserCircle as AccountsIcon } from "lucide-react";

export function AccountsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><AccountsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Your Account"
      description="Manage your account"
      content={
        <p>Manage your account</p>
      }
    />
  )
}
