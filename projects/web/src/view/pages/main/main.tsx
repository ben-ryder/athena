import React from "react";
import { DatabaseDialog } from "../../features/database/manager/database-dialog";
import { PagesDialog } from "../../features/pages/manager/pages-dialog";
import { ViewsDialog } from "../../features/views/manager/views-dialog";
import { SearchDialog } from "../../features/search/search-dialog";
import { TagsDialog } from "../../features/tags/manager/tags-dialog";
import { AttachmentsDialog } from "../../features/attachments/manager/attatchments-dialog";
import { LogsDialog } from "../../features/logs/logs-dialog";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { AccountsDialog } from "../../features/accounts/manager/accounts-dialog";
import { LFBProvider } from "../../../utils/lfb-context";

import "./main.scss"

export function MainPage() {
  return (
    <LFBProvider>
      <div className="athena">
        <div className="athena__ribbon">
          <div className="athena__ribbon-menu">
            <DatabaseDialog />
            <div className="sidebar-divider" />
            <PagesDialog />
            <ViewsDialog />
            <SearchDialog />
            <div className="sidebar-divider" />
            <TagsDialog />
            <AttachmentsDialog />
            <div className="sidebar-separator" />
            <LogsDialog />
            <SettingsDialog />
            <div className="sidebar-divider" />
            <AccountsDialog />
          </div>
        </div>
        <main className="athena__main">
          <p>This is a test...</p>
        </main>
      </div>
    </LFBProvider>
  );
}
