import { useState } from "react";
import { ContentManagerScreens } from "../../../common/content-manager/content-manager";
import { ListFieldsScreen } from "./screens/list-fields-screen";

export type SettingsTabs = "tags" | "content-types" | "fields" | "attachments" | "app-settings"

export function FieldsManager() {
  const [currentScreen, navigate] = useState<ContentManagerScreens>({screen: "list"})

  if (currentScreen.screen === "new") {
    return <p>field add</p>
  }
  else if (currentScreen.screen === "edit") {
    return <p>field edit</p>
  }
  else {
    return <ListFieldsScreen navigate={navigate} />
  }
}
