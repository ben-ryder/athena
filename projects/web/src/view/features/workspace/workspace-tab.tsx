import {useWorkspaceContext, WorkspaceTab} from "./workspace-context";

export interface TabProps {
	tab: WorkspaceTab
	tabIndex: number
}

export function Tab(props: TabProps) {
	const {closeTab} = useWorkspaceContext()

	let display: string = props.tab.type
	switch (props.tab.type) {
		case "content": {
			display = `content ${props.tab.contentId}`
			break;
		}
		case "content_new": {
			display = `new content, type ${props.tab.contentTypeId}`
			break;
		}
		case "content_list": {
			display = `content list`
			break;
		}
		case "view": {
			display = `view ${props.tab.viewId}`
			break;
		}
		case "view_list": {
			display = `view list`
			break;
		}
		case "search": {
			display = `search`
			break;
		}
	}

	return (
		<div>
			{display}

			<button onClick={() => {closeTab(props.tabIndex)}}>close</button>
		</div>
	)
}