import {useCallback, useEffect, useRef, useState} from "react";
import {AthenaTableSchemas, AthenaTableTypes} from "../../../state/athena-localful";
import {ContentTypeData} from "../../../state/schemas/content-types/content-types";
import {EntityDto} from "@localful-athena/types/data-entities";
import {ContentData} from "../../../state/schemas/content/content";
import {useLocalful} from "@localful-athena/react/use-localful";
import {FieldStorage, FieldValues} from "../../../state/schemas/fields/fields";

// todo: make type require at least one of these?
export interface ContentFormOptions {
	contentTypeId?: string
	contentId?: string
}

export interface ContentFormData {
	name: string,
	tags: string[]
	isFavourite?: boolean
	fieldStorage: FieldStorage
}

export interface ContentFormDataHandlers {
	onNameChange: (name: string) => void;
	onTagsChange: (tags: string[]) => void;
	onIsFavouriteChange: (isFavourite: boolean) => void
	onFieldStorageChange: (key: string, value: FieldValues) => void
}

/**
 *
 * @param options
 */
export function useContentFormData(options: ContentFormOptions) {
	const {currentDatabase} = useLocalful<AthenaTableTypes, AthenaTableSchemas>()

	const [contentTypeId, setContentTypeId] = useState<string | undefined>(options.contentTypeId)
	const [contentType, setContentType] = useState<EntityDto<ContentTypeData> | undefined>()

	const latestFieldStorage = useRef<FieldStorage>({})
	const [fieldStorage, setFieldStorage] = useState<FieldStorage>({})

	const latestContent = useRef<EntityDto<ContentData> | undefined>()
	const [content, setContent] = useState<EntityDto<ContentData> | undefined>()

	const latestName = useRef<string>('')
	const [name, setName] = useState<string>('')

	const latestTags = useRef<string[]>([])
	const [tags, setTags] = useState<string[]>([])

	const latestIsFavourite = useRef<boolean>(false)
	const [isFavourite, setIsFavourite] = useState<boolean>(false)

	// Load content type
	useEffect(() => {
		if (!currentDatabase) return

		const queryContentTypeId = options.contentTypeId || contentTypeId
		if (queryContentTypeId) {
			const contentTypeQuery = currentDatabase?.liveGet('content_types', queryContentTypeId)
			const subscription = contentTypeQuery.subscribe((liveQuery) => {
				if (liveQuery.status === 'success') {
					setContentType(liveQuery.result)
				}
				else if (liveQuery.status === 'error') {
					console.error('Error loading content type')
					console.log(liveQuery.errors)
				}
			})

			return () => {
				subscription.unsubscribe()
			}
		}
	}, [options.contentTypeId, contentTypeId, currentDatabase])

	// Load content
	useEffect(() => {
		if (!currentDatabase) return

		if (options.contentId) {
			const contentQuery = currentDatabase?.liveGet('content', options.contentId)
			const subscription = contentQuery.subscribe((liveQuery) => {
				if (liveQuery.status === 'success') {
					console.debug(liveQuery.result)

					/**
					 * This logic "merges" the new loaded content with the existing content, and will
					 * not overwrite anything that the user has changed so edits are not lost.
					 */
					if (latestName.current === '' || latestName.current === latestContent.current?.data.name) {
						setName(liveQuery.result.data.name)
					}
					// todo: I don't think this array comparison will work, might need to "diff" it instead?
					if (latestTags.current.length === 0 || latestTags.current === latestContent.current?.data.tags) {
						setTags(liveQuery.result.data.tags)
					}
					if (!latestIsFavourite.current || latestIsFavourite.current === latestContent.current?.data.isFavourite) {
						setIsFavourite(liveQuery.result.data.isFavourite ?? false)
					}

					setContentTypeId(liveQuery.result.data.type)
					setContent(liveQuery.result)
					setFieldStorage(liveQuery.result.data.fields)
				}
				else if (liveQuery.status === 'error') {
					console.error('Error loading content')
					console.log(liveQuery.errors)
				}
			})

			return () => {
				subscription.unsubscribe()
			}
		}
	}, [options.contentId, currentDatabase])

	useEffect(() => {
		latestName.current = name
	}, [name]);

	useEffect(() => {
		latestTags.current = tags
	}, [tags]);

	useEffect(() => {
		latestContent.current = content
	}, [content])

	useEffect(() => {
		latestIsFavourite.current = isFavourite
	}, [isFavourite])

	useEffect(() => {
		latestFieldStorage.current = fieldStorage
	}, [fieldStorage])

	const setField = useCallback((id: string, value: FieldValues) => {
		const updatedFields = {
			...latestFieldStorage.current,
		}
		updatedFields[id] = value
		setFieldStorage(updatedFields)
	}, [])

	return {
		contentTypeId,
		contentType,
		name,
		setName,
		tags,
		setTags,
		isFavourite,
		setIsFavourite,
		fieldStorage,
		setField,
	}
}
