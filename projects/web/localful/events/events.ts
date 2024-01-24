
export enum EventTypes {
	DATABASE_SWITCH = 'database-switch',
	DATA_CHANGE = 'data-change'
}


export interface EventContext {
	contextId: string
}

export interface DataChangeEvent {
	type: EventTypes.DATA_CHANGE,
	detail: {
		context: EventContext,
		data: {
			entityKey: string
			action: 'create' | 'update' | 'delete' | 'purge'
			id: string,
		}
	}
}

export interface DatabaseSwitchEvent {
	type: EventTypes.DATABASE_SWITCH,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export type LocalfulEvent = DataChangeEvent | DatabaseSwitchEvent

export interface EventMap {
	[EventTypes.DATABASE_SWITCH]: DatabaseSwitchEvent,
	[EventTypes.DATA_CHANGE]: DataChangeEvent
}
