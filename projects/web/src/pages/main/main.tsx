import React, {useState} from "react";
import { LFBProvider } from "../../utils/lfb-context";

import "./main.scss"
import {WorkspaceContextProvider} from "../../features/workspace/workspace-context";
import {Workspace} from "../../features/workspace/workspace";
import {MenuPanel} from "../../patterns/layout/menu-panel/menu-panel";
import {DatabaseDialogProvider} from "../../features/databases/database-dialog";
import {DatabaseDialog} from "../../features/databases/database-dialog";
import {NewContentDialog, NewContentDialogProvider} from "../../features/new-content/new-content-dialog";
import {StatusDialog, StatusDialogProvider} from "../../features/status/status-dialog";
import {SearchDialog, SearchDialogProvider} from "../../features/search/search-dialog";
import {DataStructureDialog, DataStructureDialogProvider} from "../../features/data-structure/data-structure-dialog";

export function MainPage() {
  const [isMenuPanelOpen, setIsOpenPanelOpen] = useState<boolean>(false)

  return (
    <LFBProvider>
      <WorkspaceContextProvider>
        <DatabaseDialogProvider>
          <NewContentDialogProvider>
            <StatusDialogProvider>
              <SearchDialogProvider>
                <DataStructureDialogProvider>
                  <main className="athena">
                    <MenuPanel/>
                    <Workspace/>

                    <DatabaseDialog/>
                    <NewContentDialog/>
                    <StatusDialog/>
                    <SearchDialog/>
                    <DataStructureDialog />
                  </main>
                </DataStructureDialogProvider>
              </SearchDialogProvider>
            </StatusDialogProvider>
          </NewContentDialogProvider>
        </DatabaseDialogProvider>
      </WorkspaceContextProvider>
    </LFBProvider>
  );
}
