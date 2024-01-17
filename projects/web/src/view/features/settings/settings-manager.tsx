import { ReactNode, useState } from "react";
import { AttachmentsManagerPage } from "../attachments/manager/attachments-manager";
import { JButton, JButtonGroup } from "@ben-ryder/jigsaw-react";
import { TagsManager } from "./tags/tags-manager";
import { FieldsManager } from "./fields/fields-manager";

export type SettingsTabs = "tags" | "content-types" | "fields" | "attachments" | "app-settings"

export function SettingsManager() {
  const [currentTab, setCurrentTab] = useState<SettingsTabs>("tags")

  let content: ReactNode
  if (currentTab === "tags") {
    content = <TagsManager />
  }
  else if (currentTab === "fields") {
    content = <FieldsManager />
  }
  else if (currentTab === "attachments") {
    content = <AttachmentsManagerPage />
  }
  else {
    content = <p>Tab Not Found: {currentTab}</p>
  }

  return (
    <div>
      <JButtonGroup align="left">
        <JButton onClick={() => setCurrentTab("tags")}>Tags</JButton>
        <JButton onClick={() => setCurrentTab("content-types")}>Content Types</JButton>
        <JButton onClick={() => setCurrentTab("fields")}>Fields</JButton>
        <JButton onClick={() => setCurrentTab("attachments")}>Attachments</JButton>
        <JButton onClick={() => setCurrentTab("app-settings")}>App Settings</JButton>
      </JButtonGroup>

      <div>
        {content}
      </div>
    </div>
  )
}
