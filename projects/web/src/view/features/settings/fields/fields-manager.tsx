import { useState } from "react";
import { ContentManagerScreens } from "../../../common/content-manager/content-manager";
import { ListFieldsScreen } from "./screens/list-fields-screen";
import {CreateFieldScreen} from "./forms/create-field-screen";

export function FieldsManager() {
  const [currentScreen, navigate] = useState<ContentManagerScreens>({screen: "list"})

  if (currentScreen.screen === "new") {
    return <CreateFieldScreen navigate={navigate} />
  }
  else if (currentScreen.screen === "edit") {
    return <p>field edit</p>
  }
  else {
    return <ListFieldsScreen navigate={navigate} />
  }
}
