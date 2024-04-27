import { ReactNode, useState } from "react";
import { AttachmentsManagerPage } from "../attachments/manager/attachments-manager";
import { JButton, JButtonGroup } from "@ben-ryder/jigsaw-react";
import { TagsManager } from "./tags/tags-manager";
import { FieldsManager } from "./fields/fields-manager";
import {PerformanceManager} from "./performance/performance-manager";
import {ContentTypesManager} from "./content-types/content-types-manager";

export type SettingsTabs = "tags" | "content-types" | "fields" | "attachments" | "performance"

export function DataStructureManager() {
  const [currentTab, setCurrentTab] = useState<SettingsTabs>("tags")

  let content: ReactNode
  if (currentTab === "tags") {
    content = <TagsManager />
  }
  else if (currentTab === "content-types") {
    content = <ContentTypesManager />
  }
  else if (currentTab === "fields") {
    content = <FieldsManager />
  }
  else if (currentTab === "attachments") {
    content = <AttachmentsManagerPage />
  }
  else if (currentTab === "performance") {
    content = <PerformanceManager />
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
        <JButton onClick={() => setCurrentTab("performance")}>Device Benchmark</JButton>
      </JButtonGroup>

      <div>
        {content}
      </div>
    </div>
  )
}
