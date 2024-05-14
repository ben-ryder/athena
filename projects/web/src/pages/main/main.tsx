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
import {SearchDialog, SearchDialogProvider} from "../../features/search/dialog/search-dialog";
import {DataStructureDialog, DataStructureDialogProvider} from "../../features/data-structure/data-structure-dialog";
import { ViewsDialog, ViewsDialogProvider } from "../../features/views/dialog/views-dialog";
import {ContentListDialog, ContentListDialogProvider} from "../../features/content-list/dialog/content-list-dialog";

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
                  <ViewsDialogProvider>
                    <ContentListDialogProvider>
                      <main className="athena">
                        <MenuPanel/>
                        <Workspace/>

                        <DatabaseDialog/>
                        <NewContentDialog/>
                        <StatusDialog/>
                        <SearchDialog/>
                        <DataStructureDialog/>
                        <ViewsDialog/>
                        <ContentListDialog />
                      </main>
                    </ContentListDialogProvider>
                  </ViewsDialogProvider>
                </DataStructureDialogProvider>
              </SearchDialogProvider>
            </StatusDialogProvider>
          </NewContentDialogProvider>
        </DatabaseDialogProvider>
      </WorkspaceContextProvider>
    </LFBProvider>
  );
}
