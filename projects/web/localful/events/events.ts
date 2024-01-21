
export const EventTypes = {
	DATA_CHANGE: 'data-change'
} as const

export const DataEventCauses = {
	CREATE: 'create',
	UPDATE: 'update',
	DELETE: 'delete'
} as const

export interface DataEventDetails {
	cause: typeof DataEventCauses[keyof typeof DataEventCauses]
	id: string,
}

export function getDataEventKey(entityTable: string) {
	return `${EventTypes.DATA_CHANGE}-${entityTable}`
}

export function createDataEvent(entityTable: string, details: DataEventDetails) {
	const eventKey = getDataEventKey(entityTable)
	return new CustomEvent(eventKey, {
		detail: details
	})
}
