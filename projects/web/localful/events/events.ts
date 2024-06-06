
export const EventTypes = {
	DATA_CHANGE: 'data-change',
	VAULT_SWITCH: 'vault-switch',
	VAULT_CLOSE: 'vault-close',
} as const


export interface EventContext {
	contextId: string
}

export interface DataChangeEvent {
	type: typeof EventTypes.DATA_CHANGE,
	detail: {
		context: EventContext,
		data: {
			tableKey: string
			action: 'create' | 'update' | 'delete' | 'purge'
			id: string,
		}
	}
}

export interface VaultSwitchEvent {
	type: typeof EventTypes.VAULT_SWITCH,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export interface VaultCloseEvent {
	type: typeof EventTypes.VAULT_CLOSE,
	detail: {
		context: EventContext,
		data: {
			id: string
		}
	}
}

export type LocalfulEvent = DataChangeEvent | VaultSwitchEvent | VaultCloseEvent

export interface EventMap {
	[EventTypes.DATA_CHANGE]: DataChangeEvent
	[EventTypes.VAULT_SWITCH]: VaultSwitchEvent,
	[EventTypes.VAULT_CLOSE]: VaultCloseEvent,
}

export type EventTypes = keyof EventMap
