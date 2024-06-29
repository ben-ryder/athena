import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {DATA_SCHEMA} from "../../state/athena-localful";
import {ErrorCallout} from "../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../workspace/workspace-context";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {useLocalful} from "@localful-athena/react/use-localful";

export interface ViewListProps {
	onOpen?: () => void
}

export function ViewList(props: ViewListProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
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

	if (contentQuery.status === 'loading') {
		return <p>Loading...</p>
	}
	if (contentQuery.status === 'error') {
		return <ErrorCallout errors={contentQuery.errors} />
	}

	return (
		<div>
			{contentQuery.data.length > 0
				? (
					<ul>
						{contentQuery.data.map(view => (
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
