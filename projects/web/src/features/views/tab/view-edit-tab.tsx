import { WithTabData } from "../../workspace/workspace";
import {localful} from "../../../state/athena-localful";
import {useWorkspaceContext} from "../../workspace/workspace-context";
import {useCallback, useEffect} from "react";
import {useViewFormData, ViewFormOptions} from "../form/useViewFormData";
import {ViewForm} from "../form/view-form";
import {JButton} from "@ben-ryder/jigsaw-react";

export interface ViewEditTabProps extends WithTabData, ViewFormOptions {}

export function ViewEditTab(props: ViewEditTabProps) {
	const { replaceTab, setTabName, setTabIsUnsaved, closeTab, openTab } = useWorkspaceContext()

	const {
		name,
		setName,
		description,
		setDescription,
		tags,
		setTags,
		isFavourite,
		setIsFavourite,
		queryTags,
		setQueryTags,
		queryContentTypes,
		setQueryContentTypes,
	} = useViewFormData({viewId: props.viewId})

	const onSave = useCallback(async () => {
		if (props.viewId) {
			const result = await localful.db.update('views', props.viewId, {
				name: name,
				description: description !== '' ? description : undefined,
				tags:  tags,
				isFavourite: isFavourite,
				queryTags: queryTags,
				queryContentTypes: queryContentTypes,
			})
			if (result.success) {
				setTabIsUnsaved(props.tabIndex, false)
			}
			else {
				console.error(result.errors)
			}
		}
		else {
			const result = await localful.db.create('views', {
				name: name,
				description: description !== '' ? description : undefined,
				tags:  tags,
				isFavourite: isFavourite,
				queryTags: queryTags,
				queryContentTypes: queryContentTypes,
			})
			if (result.success) {
				replaceTab(props.tabIndex, {type: 'view', viewId: result.data})
			}
			else {
				console.error(result.errors)
			}
		}
	}, [replaceTab, setTabIsUnsaved])

	// viewId is a dependency to ensure the tab name updates
	// when a "new view" tab is replaced with a "view" tab.
	useEffect(() => {
		setTabName(props.tabIndex, `[edit] ${name}`)
	}, [name, props.viewId]);

	const onDelete = useCallback(async () => {
		if (!props.viewId) {
			// this should never really happen, but protect against it just in case.
			console.error('Attempted to delete view with no viewId')
			return
		}

		const result = await localful.db.delete('views', props.viewId)
		if (result.success) {
			closeTab(props.tabIndex)
		}
		else {
			console.error(result.errors)
		}
	}, [props.viewId])

	const onNameChange = useCallback((name: string) => {
		setTabIsUnsaved(props.tabIndex, true)
		setName(name)
	}, [props.tabIndex])

	const onDescriptionChange = useCallback((description: string) => {
		setTabIsUnsaved(props.tabIndex, true)
		setDescription(description)
	}, [props.tabIndex])

	const onTagsChange = useCallback((tags: string[]) => {
		setTabIsUnsaved(props.tabIndex, true)
		setTags(tags)
	}, [props.tabIndex])

	const onIsFavouriteChange = useCallback((isFavourite: boolean) => {
		setTabIsUnsaved(props.tabIndex, true)
		setIsFavourite(isFavourite)
	}, [props.tabIndex])

	const onQueryTagsChange = useCallback((queryTags: string[]) => {
		setTabIsUnsaved(props.tabIndex, true)
		setQueryTags(queryTags)
	}, [props.tabIndex])

	const onQueryContentTypesChange = useCallback((queryContentTypes: string[]) => {
		setTabIsUnsaved(props.tabIndex, true)
		setQueryContentTypes(queryContentTypes)
	}, [props.tabIndex])

	return (
		<div>
			{props.viewId &&
          <JButton
              variant='secondary'
              onClick={() => {
								if (props.viewId) {
									openTab({type: 'view', viewId: props.viewId})
								}
							}}
          >View</JButton>
			}
			<ViewForm
				name={name}
				onNameChange={onNameChange}
				description={description}
				onDescriptionChange={onDescriptionChange}
				tags={tags}
				onTagsChange={onTagsChange}
				isFavourite={isFavourite}
				onIsFavouriteChange={onIsFavouriteChange}
				queryTags={queryTags}
				onQueryTagsChange={onQueryTagsChange}
				queryContentTypes={queryContentTypes}
				onQueryContentTypesChange={onQueryContentTypesChange}
				onSave={onSave}
				tabIndex={props.tabIndex}
				onDelete={props.viewId ? onDelete : undefined}
			/>
		</div>
	)
}
