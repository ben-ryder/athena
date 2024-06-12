import React, {useState} from "react";

import "./main.scss"
import {WorkspaceContextProvider} from "../../features/workspace/workspace-context";
import {Workspace} from "../../features/workspace/workspace";
import {MenuPanel} from "../../patterns/layout/menu-panel/menu-panel";
import {NewContentDialog, NewContentDialogProvider} from "../../features/new-content/new-content-dialog";
import {StatusDialog, StatusDialogProvider} from "../../features/status/status-dialog";
import {SearchDialog, SearchDialogProvider} from "../../features/search/dialog/search-dialog";
import {DataStructureDialog, DataStructureDialogProvider} from "../../features/data-structure/data-structure-dialog";
import { ViewsDialog, ViewsDialogProvider } from "../../features/views/dialog/views-dialog";
import {ContentListDialog, ContentListDialogProvider} from "../../features/content-list/dialog/content-list-dialog";
import {SettingsDialog, SettingsDialogProvider} from "../../features/settings/settings-dialog";
import {LocalfulContextProvider} from "@localful-athena/react/use-localful";
import {DATA_SCHEMA} from "../../state/athena-localful";
import {DatabaseManagerDialog, DatabaseManagerDialogProvider} from "../../features/databases/database-manager";

export function MainPage() {
  const [isMenuPanelOpen, setIsOpenPanelOpen] = useState<boolean>(false)

  return (
    <LocalfulContextProvider dataSchema={DATA_SCHEMA}>
      <WorkspaceContextProvider>
        <DatabaseManagerDialogProvider>
          <NewContentDialogProvider>
            <StatusDialogProvider>
              <SearchDialogProvider>
                <DataStructureDialogProvider>
                  <ViewsDialogProvider>
                    <ContentListDialogProvider>
                      <SettingsDialogProvider>
                        <main className="athena">
                          <MenuPanel/>
                          <Workspace/>

                          <DatabaseManagerDialog/>
                          <NewContentDialog/>
                          <StatusDialog/>
                          <SearchDialog/>
                          <DataStructureDialog/>
                          <ViewsDialog/>
                          <ContentListDialog/>
                          <SettingsDialog/>
                        </main>
                      </SettingsDialogProvider>
                    </ContentListDialogProvider>
                  </ViewsDialogProvider>
                </DataStructureDialogProvider>
              </SearchDialogProvider>
            </StatusDialogProvider>
          </NewContentDialogProvider>
        </DatabaseManagerDialogProvider>
      </WorkspaceContextProvider>
    </LocalfulContextProvider>
  );
}
