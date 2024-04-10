import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {localful} from "../../../state/athena-localful";
import {QueryStatus} from "@localful-athena/control-flow";
import {JButton} from "@ben-ryder/jigsaw-react";
import {useWorkspaceContext} from "./workspace-context";

export function NewContentMenu() {
	const contentTypesQuery = useObservableQuery(localful.db.observableQuery('content_types'))
	const { openTab } = useWorkspaceContext()

	return (
		<div>
			<div>
				<h3>Add Content:</h3>
				{contentTypesQuery.status === QueryStatus.SUCCESS &&
					<ul>
						{contentTypesQuery.data.map(type =>
							<li key={type.id}>
								<JButton
									onClick={() => {openTab({type: 'content_new', contentTypeId: type.id}, {switch: true})}}
								>{type.data.name}</JButton></li>
						)}
					</ul>
				}
			</div>
		</div>
	)
}
