import { useState } from "react";
import { ContentManagerScreens } from "../../../common/content-manager/content-manager";
import {CreateContentTypeScreen} from "./screens/create-content-type-screen";
import {EditContentTypeScreen} from "./screens/edit-content-type-screen";
import {ListContentTypesScreen} from "./screens/list-content-types-screen";
export function ContentTypesManager() {
  const [currentScreen, navigate] = useState<ContentManagerScreens>({screen: "list"})

  if (currentScreen.screen === "new") {
    return <CreateContentTypeScreen navigate={navigate} />
  }
  else if (currentScreen.screen === "edit") {
    return <EditContentTypeScreen navigate={navigate} id={currentScreen.id} />
  }
  else {
    return <ListContentTypesScreen navigate={navigate} />
  }
}
