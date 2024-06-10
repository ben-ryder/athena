import {ContentForm} from "../form/content-form";

import { WithTabData } from "../../workspace/workspace";
import {DATA_SCHEMA} from "../../../state/athena-localful";
import {useWorkspaceContext} from "../../workspace/workspace-context";
import {useCallback, useEffect} from "react";
import {ContentFormOptions, useContentFormData} from "../form/useContentFormData";
import {useLocalful} from "@localful-athena/react/use-localful";

export interface ContentTabProps extends WithTabData, ContentFormOptions {}

export function ContentTab(props: ContentTabProps) {
	const {currentDatabase} = useLocalful<DATA_SCHEMA>()
	const { replaceTab, setTabName, setTabIsUnsaved, closeTab } = useWorkspaceContext()

	const {
		contentTypeId,
		name,
		setName,
		description,
		setDescription,
		tags,
		setTags,
		isFavourite,
		setIsFavourite,
	} = useContentFormData({contentId: props.contentId, contentTypeId: props.contentTypeId})

	const onSave = useCallback(async () => {
		// todo: does this need feedback of some kind?
		if (!currentDatabase) return

		if (!contentTypeId) {
			// this should never really happen, but protect against it just in case.
			console.error('Attempted to save with no content type')
			return
		}

		if (props.contentId) {
			const result = await currentDatabase.update('content', props.contentId, {
				type: contentTypeId,
				name: name,
				description: description !== '' ? description : undefined,
				tags:  tags,
				fields: {},
				isFavourite: isFavourite
			})
			if (result.success) {
				setTabIsUnsaved(props.tabIndex, false)
			}
			else {
				console.error(result.errors)
			}
		}
		else {
			const result = await currentDatabase.create('content', {
				type: contentTypeId,
				name: name,
				description: description !== '' ? description : undefined,
				tags:  tags,
				fields: {},
				isFavourite: isFavourite
			})
			if (result.success) {
				replaceTab(props.tabIndex, {type: 'content', contentId: result.data})
			}
			else {
				console.error(result.errors)
			}
		}
	}, [contentTypeId, replaceTab, setTabIsUnsaved])

	// contentId and contentTypeId are dependencies to ensure the tab name updates
	// when a "new content" tab is replaced with a "content" tab.
	useEffect(() => {
		setTabName(props.tabIndex, name)
	}, [name, props.contentId, props.contentTypeId]);

	const onDelete = useCallback(async () => {
		// todo: does this need feedback of some kind?
		if (!currentDatabase) return

		if (!props.contentId) {
			// this should never really happen, but protect against it just in case.
			console.error('Attempted to delete content with no contentId')
			return
		}

		const result = await currentDatabase.delete('content', props.contentId)
		if (result.success) {
			closeTab(props.tabIndex)
		}
		else {
			console.error(result.errors)
		}
	}, [props.contentId])

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

	return (
		<div>
			<ContentForm
				name={name}
				description={description}
				tags={tags}
				onNameChange={onNameChange}
				onDescriptionChange={onDescriptionChange}
				onTagsChange={onTagsChange}
				isFavourite={isFavourite}
				onIsFavouriteChange={onIsFavouriteChange}
				onSave={onSave}
				tabIndex={props.tabIndex}
				onDelete={props.contentId ? onDelete : undefined}
			/>
		</div>
	)
}