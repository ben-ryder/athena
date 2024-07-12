import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../state/athena-localful";
import {LiveQueryStatus} from "@localful-athena/control-flow";
import {JButton} from "@ben-ryder/jigsaw-react";
import {useWorkspaceContext} from "../../workspace/workspace-context";

import "./new-content-menu.scss"
import {useLocalful} from "@localful-athena/react/use-localful";

export interface NewContentMenuProps {
	onOpen?: () => void
}

export function NewContentMenu(props: NewContentMenuProps) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()

	const contentTypesQuery = useObservableQuery(currentDatabase?.liveQuery({table: 'content_types'}))
	const { openTab } = useWorkspaceContext()

	return (
		<div className="new-content-menu">
			{contentTypesQuery.status === LiveQueryStatus.SUCCESS &&
						<>
							{contentTypesQuery.result.length > 0
								? (
									<ul className="new-content-menu__list">
										{contentTypesQuery.result.map(type =>
											<li className="new-content-menu__list-item" key={type.id}>
												<JButton
													onClick={() => {
														openTab({type: 'content_new', contentTypeId: type.id}, {switch: true})
														if (props.onOpen) {
															props.onOpen()
														}
													}}
												>{type.data.name}</JButton></li>
										)}
									</ul>
								)
								: (
									<p>No Content Types Found</p>
								)
							}
						</>
			}
		</div>
	)
}
