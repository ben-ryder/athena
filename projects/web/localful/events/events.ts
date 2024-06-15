
export const EventTypes = {
	DATA_ENTITY_CHANGE: 'data-entity-change',
	DATABASE_OPEN: 'database-open',
	DATABASE_CLOSE: 'database-close',
	DATABASE_UNLOCK: 'database-unlock',
	DATABASE_LOCK: 'database-lock',
	DATABASE_CHANGE: 'database-change',
} as const

export interface EventContext {
	contextId: string
}

export interface DataEntityChangeEvent {
	type: typeof EventTypes.DATA_ENTITY_CHANGE,
	detail: {
		context: EventContext,
		data: {
			databaseId: string
			tableKey: string
			action: 'create' | 'update' | 'delete' | 'purge'
			id: string,
		}
	}
}

export interface DatabaseOpenEvent {
	type: typeof EventTypes.DATABASE_OPEN,
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

export interface DatabaseUnlockEvent {
	type: typeof EventTypes.DATABASE_UNLOCK,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export interface DatabaseLockEvent {
	type: typeof EventTypes.DATABASE_LOCK,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export interface DatabaseChangeEvent {
	type: typeof EventTypes.DATABASE_CHANGE,
	detail: {
		context: EventContext,
		data: {
			id: string
			action: 'create' | 'update' | 'delete' | 'purge'
		}
	}
}

export type LocalfulEvent =
	DataEntityChangeEvent |
	DatabaseOpenEvent | DatabaseCloseEvent | DatabaseChangeEvent |
	DatabaseUnlockEvent | DatabaseLockEvent

export interface EventMap {
	[EventTypes.DATA_ENTITY_CHANGE]: DataEntityChangeEvent,
	[EventTypes.DATABASE_OPEN]: DatabaseOpenEvent,
	[EventTypes.DATABASE_CLOSE]: DatabaseCloseEvent,
	[EventTypes.DATABASE_UNLOCK]: DatabaseUnlockEvent,
	[EventTypes.DATABASE_LOCK]: DatabaseLockEvent,
	[EventTypes.DATABASE_CHANGE]: DatabaseChangeEvent,
}

export type EventTypes = keyof EventMap
