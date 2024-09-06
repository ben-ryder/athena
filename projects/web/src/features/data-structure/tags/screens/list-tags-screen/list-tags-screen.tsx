import { JPillButton } from "@ben-ryder/jigsaw-react";
import "./list-tags-screen.scss";
import { LiveQueryStatus } from "@localful-athena/control-flow";
import { ErrorCallout } from "../../../../../patterns/components/error-callout/error-callout";
import {
	GenericManagerScreenProps
} from "../../../../../common/generic-manager/generic-manager";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../../../state/athena-localful";
import {useLocalful} from "@localful-athena/react/use-localful";

export function ListTagsScreen(props: GenericManagerScreenProps) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()
	const tags = useObservableQuery(currentDatabase?.liveQuery({table: 'tags'}))

	return (
		<>
			<div className="tags-list">
				{tags.status === LiveQueryStatus.ERROR && <ErrorCallout errors={tags.errors} />}
				<div className="tags-list__list">
					<JPillButton
						onClick={() => {
							props.navigate({screen: "new"})
						}}
						style={{fontWeight: "bold"}}
					>
						Create New Tag
					</JPillButton>
					{tags.status === LiveQueryStatus.SUCCESS && tags.result.map((tag) => (
						<JPillButton
							onClick={() => {
								props.navigate({screen: "edit", id: tag.id})
							}}
							key={tag.id}
							variant={tag.data.colourVariant || undefined}
						>{tag.data.name}</JPillButton>
					))}
				</div>
			</div>
		</>
	);
}
