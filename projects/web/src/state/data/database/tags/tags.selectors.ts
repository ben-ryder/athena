import { ApplicationState } from "../../../application-state";
import { TagDto } from "./tags";
import { ActionResult, ApplicationError, ApplicationErrorType } from "../../../actions";

export function selectAllTags(state: ApplicationState): ActionResult<TagDto[]> {
	let tags: TagDto[] = []
	const errors: ApplicationError[] = []

	for (const tagId of state.data.current.database.db.tags.ids) {
		const tagEntity = state.data.current.database.db.tags.entities[tagId]

		if (tags) {
			tags.push(tagEntity)
		}
		else {
			errors.push({
				type: ApplicationErrorType.ENTITY_MISSING,
				userMessage: `expected tag '${tagId}' missing from database`
			})
		}
	}

	tags = tags.sort((a, b) => {
		return a.name > b.name ? 1 : 0
	})

	return {
		success: true,
		data: tags,
		errors
	}
}

export function selectTag(state: ApplicationState, id: string): ActionResult<TagDto|null> {
	const tagEntity = state.data.current.database.db.tags.entities[id]
	if (tagEntity) {
		return {
			success: true,
			data: tagEntity
		}
	}
	else {
		return {
			success: false,
			errors: [
				{
					type: ApplicationErrorType.ENTITY_MISSING,
					userMessage: `expected tag '${id}' missing from database`
				}
			]
		}
	}
}
