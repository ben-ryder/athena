import React from "react";
import {JDialog} from "@ben-ryder/jigsaw-react";
import {createModalContext} from "../../common/dialog/generic-dialog";
import {SettingsManager} from "./settings-manager";

export const {
  context: SettingsDialogContext,
  useContext: useSettingsDialog,
  provider: SettingsDialogProvider
} = createModalContext()

export function SettingsDialog() {
  const {isOpen, setIsOpen} = useSettingsDialog()

  return (
    <JDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Settings"
      description="Manage the application settings"
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
