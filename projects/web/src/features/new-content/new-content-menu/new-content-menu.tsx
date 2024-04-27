import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {localful} from "../../../state/athena-localful";
import {QueryStatus} from "@localful-athena/control-flow";
import {JButton} from "@ben-ryder/jigsaw-react";
import {useWorkspaceContext} from "../../workspace/workspace-context";

import "./new-content-menu.scss"

export interface NewContentMenuProps {
	onOpen?: () => void
}

export function NewContentMenu(props: NewContentMenuProps) {
	const contentTypesQuery = useObservableQuery(localful.db.observableQuery('content_types'))
	const { openTab } = useWorkspaceContext()

	return (
		<div className="new-content-menu">
				{contentTypesQuery.status === QueryStatus.SUCCESS &&
						<>
							{contentTypesQuery.data.length > 0
								? (
									<ul className="new-content-menu__list">
										{contentTypesQuery.data.map(type =>
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
