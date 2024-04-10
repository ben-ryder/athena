import {useWorkspaceContext} from "./workspace-context";
import {Tab, TabProps} from "./workspace-tab";
import {ReactNode} from "react";
import {NewContentTab} from "./content/new-content-tab";

export interface WithTabData {
	tabIndex: number
}

export function Workspace() {
	const {tabs, closeTab, setActiveTab, activeTab} = useWorkspaceContext()

	const workspaceTabs: TabProps[] = []
	const workspaceContent: ReactNode[] = []

	for (const [tabIndex, tab] of tabs.entries()) {
		workspaceTabs.push({
			name: tab.name || tab.type,
			contentUnsaved: !!tab.contentUnsaved,
			onClose: () => {closeTab(tabIndex)},
			onSelect: () => {setActiveTab(tabIndex)}
		})

		let tabContent: ReactNode = <p>{tab.type}</p>
		switch (tab.type) {
			case "content": {
				tabContent = <p>content {tab.contentId}</p>
				break;
			}
			case "content_new": {
				tabContent = <NewContentTab contentTypeId={tab.contentTypeId} tabIndex={tabIndex} />
				break;
			}
			case "content_list": {
				tabContent = <p>content list</p>
				break;
			}
			case "view": {
				tabContent = <p>view {tab.viewId}</p>
				break;
			}
			case "view_list": {
				tabContent = <p>view list</p>
				break;
			}
			case "search": {
				tabContent = <p>search</p>
				break;
			}
		}
		workspaceContent.push(tabContent)
	}

	return (
		<div>
			<div>
				<ul>
					{workspaceTabs.map((tab, tabIndex) => (
						<li key={tabIndex}><Tab name={tab.name} onClose={tab.onClose} onSelect={tab.onSelect} contentUnsaved={tab.contentUnsaved} /></li>
					))}
				</ul>
			</div>
			<div>
				<div>
					{workspaceContent.map((tabContent, tabIndex) => (
						<div key={tabIndex} style={{display: activeTab === tabIndex ? 'block' : 'none'}}>
							{tabContent}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}