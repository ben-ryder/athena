import {useWorkspaceContext} from "./workspace-context";
import {Tab} from "./workspace-tab";

export function Workspace() {
	const {tabs} = useWorkspaceContext()

	return (
		<div>
			<div>
				<ul>
					{tabs.map((tab, index) => <Tab tab={tab} tabIndex={index} />)}
				</ul>
			</div>
			<div>

			</div>
		</div>
	)
}