
export const EventTypes = {
	DATA_CHANGE: 'data-change',
	DATABASE_SWITCH: 'database-switch',
	DATABASE_CLOSE: 'database-close',
} as const


export interface EventContext {
	contextId: string
}

export interface DataChangeEvent {
	type: typeof EventTypes.DATA_CHANGE,
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
	type: typeof EventTypes.DATABASE_SWITCH,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export interface DatabaseCloseEvent {
	type: typeof EventTypes.DATABASE_CLOSE,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export type LocalfulEvent = DataChangeEvent | DatabaseSwitchEvent | DatabaseCloseEvent

export interface EventMap {
	[EventTypes.DATA_CHANGE]: DataChangeEvent
	[EventTypes.DATABASE_SWITCH]: DatabaseSwitchEvent,
	[EventTypes.DATABASE_CLOSE]: DatabaseCloseEvent,
}

export type EventTypes = keyof EventMap
