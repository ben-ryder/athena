import React, {useState} from "react";
import { LFBProvider } from "../../../utils/lfb-context";

import "./main.scss"
import {WorkspaceContextProvider} from "../../features/workspace/workspace-context";
import {Workspace} from "../../features/workspace/workspace";
import {MenuPanel} from "../../patterns/layout/menu-panel/menu-panel";

export function MainPage() {
  const [isMenuPanelOpen, setIsOpenPanelOpen] = useState<boolean>(false)

  return (
    <LFBProvider>
      <WorkspaceContextProvider>
        <main className="athena">
          <MenuPanel />
          <Workspace />
        </main>
      </WorkspaceContextProvider>
    </LFBProvider>
  );
}
