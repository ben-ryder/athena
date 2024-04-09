import {useWorkspaceContext} from "./workspace-context";
import {Tab, TabProps} from "./workspace-tab";
import {ReactNode} from "react";
import {NewContentTab} from "./content/new-content-tab";

export function Workspace() {
	const {tabs, closeTab, setActiveTab, activeTab, updateTabMetadata} = useWorkspaceContext()

	const workspaceTabs: TabProps[] = []
	const workspaceContent: ReactNode[] = []

	for (const [tabIndex, tab] of tabs.entries()) {
		workspaceTabs.push({
			name: 'Loading...',
			contentUnsaved: false,
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
				tabContent = <NewContentTab contentTypeId={tab.contentTypeId} tabIndex={tabIndex} updateTabMetadata={updateTabMetadata} />
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
					{workspaceTabs.map((tab) => (
						<li><Tab name={tab.name} onClose={tab.onClose} onSelect={tab.onSelect} contentUnsaved={tab.contentUnsaved} /></li>
					))}
				</ul>
			</div>
			<div>
				<div>
					{workspaceContent.map((tabContent, index) => (
						<div style={{display: activeTab === index ? 'block' : 'none'}}>
							{tabContent}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}