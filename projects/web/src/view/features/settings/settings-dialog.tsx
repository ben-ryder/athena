import React, { useState } from "react";
import { JDialog, JIcon } from "@ben-ryder/jigsaw-react";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsManager } from "./settings-management";

export function SettingsDialog() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <JDialog
      open={open}
      setOpen={setOpen}
      triggerContent={
        <button className="sidebar-button">
          <JIcon size="lg"><SettingsIcon /></JIcon>
        </button>
      }
      disableOutsideClose={true}
      heading="Settings"
      description="Manage vault and application settings"
      style={{
        width: "100%",
        maxWidth: "1000px",
        height: "100%"
      }}
      content={
        <SettingsManager />
      }
    />
  )
}
