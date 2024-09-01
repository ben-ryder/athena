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
import {AthenaTableSchemas} from "../../state/athena-localful";
import {DatabaseManagerDialog, DatabaseManagerDialogProvider} from "../../features/databases/manager/database-manager";

export function MainPage() {
	const [isMenuPanelOpen, setIsMenuPanelOpen] = useState<boolean>(true)

	return (
		<LocalfulContextProvider tableSchemas={AthenaTableSchemas}>
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
													<DatabaseManagerDialog/>

													<MenuPanel isMenuPanelOpen={isMenuPanelOpen} setIsMenuPanelOpen={setIsMenuPanelOpen}/>
													<Workspace isMenuPanelOpen={isMenuPanelOpen} setIsMenuPanelOpen={setIsMenuPanelOpen} />

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
