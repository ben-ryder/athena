import {ApplicationState} from "../../../application-state";
import { TagDto, TagEntity } from "../tags/tags";
import { ContentItemDto } from "./content-items";
import { ActionResult, ApplicationError, ApplicationErrorType } from "../../../actions";

export function selectAllItems(state: ApplicationState): ActionResult<ContentItemDto[]> {
	const contentItems: ContentItemDto[] = []
	const errors: ApplicationError[] = []

	for (const contentId of state.data.current.database.db.content.ids) {
		const contentItem = state.data.current.database.db.content.entities[contentId]

		if (contentItem) {
			const tags: TagEntity[] = [];
			for (const tagId of contentItem.tags) {
				const tag = state.data.current.database.db.tags.entities[tagId]
				if (tag) {
					tags.push(tag)
				}
				else {
					errors.push({
						type: ApplicationErrorType.ENTITY_MISSING,
						userMessage: `expected tag '${tagId}' missing from database`,
						context: `encountered missing tag while loading content '${contentId}'`
					})
				}
			}

			contentItems.push({
				...contentItem,
				tagEntities: tags
			})
		}
		else {
			errors.push({
				type: ApplicationErrorType.ENTITY_MISSING,
				userMessage: `expected tag '${contentId}' missing from database`,
				context: `encountered missing tag while loading content '${contentId}'`
			})
		}
	}

	return {
		success: true,
		data: contentItems,
		errors
	}
}
