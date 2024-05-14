import {useWorkspaceContext} from "./workspace-context";
import {Tab, TabProps} from "./tab";
import {ReactNode} from "react";
import {ContentTab} from "../content/tab/content-tab";

// todo: split styling by component for better encapsulation
import "./workspace.scss"
import {ContentList} from "../content-list/content-list";
import {ContentListTab} from "../content-list/tab/content-list-tab";

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
			isUnsaved: !!tab.isUnsaved,
			isActive: activeTab === tabIndex,
			onClose: () => {closeTab(tabIndex)},
			onSelect: () => {setActiveTab(tabIndex)}
		})

		let tabContent: ReactNode = <p>{tab.type}</p>
		switch (tab.type) {
			case "content_new": {
				tabContent = <ContentTab contentTypeId={tab.contentTypeId} tabIndex={tabIndex} />
				break;
			}
			case "content": {
				tabContent = <ContentTab contentId={tab.contentId} tabIndex={tabIndex} />
				break;
			}
			case "content_list": {
				tabContent = <ContentListTab />
				break;
			}
			case "view_new": {
				tabContent = <p>view new</p>
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
		}
		workspaceContent.push(tabContent)
	}

	return (
		<div className='workspace'>
			<div className='workspace-tabs'>
				<ul className='workspace-tabs__list'>
					{workspaceTabs.map((tab, tabIndex) => (
						<li className='workspace-tabs__list-item' key={tabIndex}>
							<Tab {...tab} />
						</li>
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