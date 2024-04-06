import {useWorkspaceContext, WorkspaceTab} from "./workspace-context";
import {ReactNode} from "react";
import {NewContentTab} from "./content/new-content-tab";

export interface TabProps {
	tab: WorkspaceTab
	tabIndex: number
}

export function Tab(props: TabProps) {
	const {closeTab} = useWorkspaceContext()

	let displayElement: ReactNode = <p>props.tab.type</p>
	switch (props.tab.type) {
		case "content": {
			displayElement = <p>content {props.tab.contentId}</p>
			break;
		}
		case "content_new": {
			displayElement = <NewContentTab contentTypeId={props.tab.contentTypeId} />
			break;
		}
		case "content_list": {
			displayElement = <p>content list</p>
			break;
		}
		case "view": {
			displayElement = <p>view {props.tab.viewId}</p>
			break;
		}
		case "view_list": {
			displayElement = <p>view list</p>
			break;
		}
		case "search": {
			displayElement = <p>search</p>
			break;
		}
	}

	return (
		<div>
			{displayElement}

			<button onClick={() => {closeTab(props.tabIndex)}}>close</button>
		</div>
	)
}