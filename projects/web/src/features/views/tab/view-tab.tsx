import {WithTabData} from "../../workspace/workspace";
import {localful} from "../../../state/athena-localful";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {QueryStatus} from "@localful-athena/control-flow";
import {ErrorCallout} from "../../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../../workspace/workspace-context";
import {JButton} from "@ben-ryder/jigsaw-react";

export interface ViewTabProps extends WithTabData {
	viewId: string
}

export function ViewTab(props: ViewTabProps) {
	const { openTab } = useWorkspaceContext()
	const viewQuery = useObservableQuery(localful.db.observableGet('views', props.viewId))

	if (viewQuery.status === QueryStatus.LOADING) {
		return (
			<p>Loading...</p>
		)
	}

	if (viewQuery.status === QueryStatus.ERROR) {
		return (
			<ErrorCallout errors={viewQuery.errors} />
		)
	}

	return (
		<div>
			{viewQuery.errors && <ErrorCallout errors={viewQuery.errors} />}
			<div>
				<JButton
					variant='secondary'
					onClick={() => {
						openTab({type: 'view_edit', viewId: props.viewId})
					}}
				>Edit</JButton>
				<h3>{viewQuery.data.data.name}</h3>
			</div>
		</div>
	)
}
