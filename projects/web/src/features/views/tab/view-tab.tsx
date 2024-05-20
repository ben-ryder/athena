import {WithTabData} from "../../workspace/workspace";
import {DATA_SCHEMA, localful} from "../../../state/athena-localful";
import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {QueryStatus} from "@localful-athena/control-flow";
import {ErrorCallout} from "../../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../../workspace/workspace-context";
import {JButton} from "@ben-ryder/jigsaw-react";
import {useEffect, useState} from "react";
import {ContentDto} from "../../../state/schemas/content/content";
import {IndexWhereOption} from "@localful-athena/storage/types";
import {ContentCard} from "../../../patterns/components/content-card/content-card";

import "./view-tab.scss"

export interface ViewTabProps extends WithTabData {
	viewId: string
}

export function ViewTab(props: ViewTabProps) {
	const { openTab, setTabName } = useWorkspaceContext()
	const viewQuery = useObservableQuery(localful.db.observableGet('views', props.viewId))

	useEffect(() => {
		if (viewQuery.status === 'success') {
			setTabName(props.tabIndex, viewQuery.data.data.name)
		}
	}, [viewQuery.status]);

	const [results, setResults] = useState<ContentDto[]>([])

	useEffect(() => {
		if (viewQuery.status === 'loading' || viewQuery.status === 'error') {
			setResults([])
		}
		else {
			const queryIndex: IndexWhereOption<DATA_SCHEMA, 'content'>|undefined = viewQuery.data.data.queryContentTypes.length > 0 ?
				{
					field: 'type',
					operation: 'includes',
					value: viewQuery.data.data.queryContentTypes
				} : undefined

			const resultsQuery = localful.db.observableQuery({
				table: 'content',
				index: queryIndex,
				whereCursor: (entity, version) => {
					if (viewQuery.data.data.queryTags.length === 0) {
						return true
					}

					for (const tagId of viewQuery.data.data.queryTags) {
						if (!entity.tags.includes(tagId)) {
							return false
						}
					}

					return true
				}
			})
			const resultQuerySubscription = resultsQuery.subscribe((result) => {
				if (result.status === 'success') {
					setResults(result.data)
				}
				else if (result.status === 'error') {
					// todo: should output errors to users?
					console.error(result.errors)
				}
			})

			return () => {
				resultQuerySubscription.unsubscribe()
			}
		}
	}, [viewQuery.status])

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
		<div className='view'>
			{viewQuery.errors && <ErrorCallout errors={viewQuery.errors} />}
			<div className='view__header'>
				<h3 className='view__title'>{viewQuery.data.data.name}</h3>
				<JButton
					variant='secondary'
					onClick={() => {
						openTab({type: 'view_edit', viewId: props.viewId})
					}}
				>Edit</JButton>
			</div>
			<div className='view__display'>
				<div className='view-display-list'>
					{results.length > 0 &&
						<ul>
							{results.map(result => (
								<ContentCard key={result.id} id={result.id} name={result.data.name} onSelect={() => {
									openTab({type: 'content', contentId: result.id})
								}} />
							))}
						</ul>
					}
				</div>
			</div>
		</div>
	)
}
