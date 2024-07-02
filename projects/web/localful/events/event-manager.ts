import {EventContext, EventMap, EventTypes, LocalfulEvent} from "./events";
import { LocalfulEncryption } from "../encryption/encryption";
import {Logger} from "../../src/utils/logger";

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

		this.crossContextChannel = new BroadcastChannel("localful_events")
		this.crossContextChannel.onmessage = (message: MessageEvent<LocalfulEvent>) => {
			Logger.debug('[EventManager] Received broadcast channel message', message.data)
			this.dispatch(message.data.type, message.data.detail.data, message.data.detail.context)
		}
	}

	dispatch<Event extends keyof EventMap>(type: Event, data: EventMap[Event]['detail']['data'], context?: EventContext) {
		const eventDetail = {
			context: context || {contextId: this.contextId},
			data: data,
		}

		Logger.debug(`[EventManager] Dispatching event:`, type, eventDetail)

		const event = new CustomEvent(type, { detail: eventDetail })
		this.eventTarget.dispatchEvent(event)

		// Only broadcast events that originate in the current context, otherwise hello infinite event ping pong!
		if (this.crossContextChannel && eventDetail.context.contextId === this.contextId) {
			// Don't send open/close events as that is unique to every instance.
			if (type !== EventTypes.DATABASE_OPEN && type !== EventTypes.DATABASE_CLOSE) {
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
}
