import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {AthenaTableSchemas, AthenaTableTypes} from "../../state/athena-localful";
import {ErrorCallout} from "../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../workspace/workspace-context";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {useLocalful} from "@localful-athena/react/use-localful";
import { LiveQueryStatus } from "@localful-athena/control-flow";

export interface ViewListProps {
	onOpen?: () => void
}

export function ViewList(props: ViewListProps) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()
	const { openTab } = useWorkspaceContext()

	const contentQuery = useObservableQuery(currentDatabase?.liveQuery({
		table: 'views',
		whereCursor: (localEntity, version) => {
			return true
		},
		whereData: (entityDto) => {
			return true
		},
		sort: (dtos) => {
			return dtos
		}
	}))

	if (contentQuery.status === LiveQueryStatus.LOADING) {
		return <p>Loading...</p>
	}
	if (contentQuery.status === LiveQueryStatus.ERROR) {
		return <ErrorCallout errors={contentQuery.errors} />
	}

	return (
		<div>
			{contentQuery.result.length > 0
				? (
					<ul>
						{contentQuery.result.map(view => (
							<ContentCard
								key={view.id}
								id={view.id}
								name={view.data.name}
								description={view.data.description}
								onSelect={() => {
									openTab({type: "view", viewId: view.id})
									if (props.onOpen) {
										props.onOpen()
									}
								}}
							/>
						))}
					</ul>
				)
				: (
					<p>No Views Found</p>
				)
			}
		</div>
	)
}
