import { DatabaseSwitchEvent, EventContext, EventMap, EventTypes, LocalfulEvent } from "./events";
import { LocalfulEncryption } from "../encryption/localful-encryption";

/**
 * Handles events throughout Localful, including communicating with
 * Localful instances in other browser contexts.
 *
 */
export class EventManager {
	eventTarget: EventTarget
	crossContextChannel: BroadcastChannel | undefined
	contextId: string

	constructor() {
		this.eventTarget = new EventTarget()
		this.contextId = LocalfulEncryption.generateUUID()

		// Automatically handle the setup of cross context communication when the database is switched
		// @ts-expect-error - As events are typed, a database switch event will be a custom event with the given details.
		this.eventTarget.addEventListener(EventTypes.DATABASE_SWITCH, (e: CustomEvent<DatabaseSwitchEvent['detail']>) => {
			this.openCrossContextChannel(e.detail.data.id)
		})
	}

	dispatch<Event extends keyof EventMap>(type: Event, data: EventMap[Event]['detail']['data'], context?: EventContext) {
		const eventDetail = {
			context: context || {contextId: this.contextId},
			data: data,
		}

		const event = new CustomEvent(type, { detail: eventDetail })
		this.eventTarget.dispatchEvent(event)

		// Only broadcast events that originate in the current context, otherwise hello infinite event ping pong!
		if (this.crossContextChannel && eventDetail.context.contextId === this.contextId) {
			// Each context can use a different database, so that event should never be broadcast otherwise all contexts would update!
			if (type !== 'database-switch') {
				this.crossContextChannel.postMessage({ type, detail: eventDetail })
			}
		}
	}

	subscribe<Event extends keyof EventMap>(type: Event, callback: (e: CustomEvent<EventMap[Event]['detail']>) => void) {
		// @ts-expect-error - We can add a callback for custom events!
		this.eventTarget.addEventListener(type, callback)
	}

	unsubscribe<Event extends keyof EventMap>(type: Event, callback: (e: CustomEvent<EventMap[Event]['detail']>) => void) {
		// @ts-expect-error - We can add a callback for custom events!
		this.eventTarget.removeEventListener(type, callback)
	}

	openCrossContextChannel(databaseId: string) {
		this.closeCrossContextChannel()

		this.crossContextChannel = new BroadcastChannel(`localful_${databaseId}`)
		this.crossContextChannel.onmessage = (message: MessageEvent<LocalfulEvent>) => {
			this.dispatch(message.data.type, message.data.detail.data, message.data.detail.context)
		}
	}

	closeCrossContextChannel() {
		if (this.crossContextChannel) {
			this.crossContextChannel.close()
		}
	}
}
