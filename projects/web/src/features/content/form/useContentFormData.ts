import {useEffect, useRef, useState} from "react";
import {localful} from "../../../state/athena-localful";
import {ContentTypeData} from "../../../state/schemas/content-types/content-types";
import {EntityDto} from "@localful-athena/storage/entity-types";
import {ContentData} from "../../../state/schemas/content/content";

// todo: make type require at least one of these?
export interface ContentFormOptions {
    contentTypeId?: string
    contentId?: string
}

export interface ContentFormData {
    name: string,
    description?: string
    tags: string[]
    isFavourite?: boolean
}

export interface ContentFormDataHandlers {
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onTagsChange: (tags: string[]) => void;
    onIsFavouriteChange: (isFavourite: boolean) => void
}

/**
 *
 * @param options
 */
export function useContentFormData(options: ContentFormOptions) {
    const [contentTypeId, setContentTypeId] = useState<string | undefined>(options.contentTypeId)

    const [contentType, setContentType] = useState<EntityDto<ContentTypeData> | undefined>()

    const latestContent = useRef<EntityDto<ContentData> | undefined>()
    const [content, setContent] = useState<EntityDto<ContentData> | undefined>()

    const latestName = useRef<string>('')
    const [name, setName] = useState<string>('')

    const latestDescription = useRef<string|undefined>(undefined)
    const [description, setDescription] = useState<string|undefined>(undefined)

    const latestTags = useRef<string[]>([])
    const [tags, setTags] = useState<string[]>([])

    const latestIsFavourite = useRef<boolean>(false)
    const [isFavourite, setIsFavourite] = useState<boolean>(false)

    // Load content type
    useEffect(() => {
        if (options.contentTypeId) {
            const contentTypeQuery = localful.db.observableGet('content_types', options.contentTypeId)
            const subscription = contentTypeQuery.subscribe((data) => {
                if (data.status === 'success') {
                    setContentType(data.data)
                }
                else if (data.status === 'error') {
                    console.error('Error loading content type')
                    console.log(data.errors)
                }
            })

            return () => {
                subscription.unsubscribe()
            }
        }
    }, [options.contentTypeId])

    // Load content
    useEffect(() => {
        if (options.contentId) {
            const contentQuery = localful.db.observableGet('content', options.contentId)
            const subscription = contentQuery.subscribe((data) => {
                if (data.status === 'success') {

                    /**
                     * This logic "merges" the new loaded content with the existing content, and will
                     * not overwrite anything that the user has changed so edits are not lost.
                     */
                    if (latestName.current === '' || latestName.current === latestContent.current?.data.name) {
                        setName(data.data.data.name)
                    }
                    if (latestDescription.current === '' || latestDescription.current === undefined || latestDescription.current === latestContent.current?.data.description) {
                        setDescription(data.data.data.description)
                    }
                    // todo: I don't think this array comparison will work, might need to "diff" it instead?
                    if (latestTags.current.length === 0 || latestTags.current === latestContent.current?.data.tags) {
                        setTags(data.data.data.tags)
                    }
                    if (!latestIsFavourite.current || latestIsFavourite.current === latestContent.current?.data.isFavourite) {
                        setIsFavourite(data.data.data.isFavourite ?? false)
                    }

                    setContentTypeId(data.data.data.type)
                    setContent(data.data)
                }
                else if (data.status === 'error') {
                    console.error('Error loading content')
                    console.log(data.errors)
                }
            })

            return () => {
                subscription.unsubscribe()
            }
        }
    }, [options.contentId])

    useEffect(() => {
        latestName.current = name
    }, [name]);

    useEffect(() => {
        latestDescription.current = description
    }, [description]);

    useEffect(() => {
        latestTags.current = tags
    }, [tags]);

    useEffect(() => {
        latestContent.current = content
    }, [content])

    useEffect(() => {
        latestIsFavourite.current = isFavourite
    }, [isFavourite])

    return {
        contentTypeId,
        name,
        setName,
        description,
        setDescription,
        tags,
        setTags,
        isFavourite,
        setIsFavourite,
    }
}
