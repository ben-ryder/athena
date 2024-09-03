import {EventContext, EventMap, EventTypes, LocalfulEvent} from "./events";
import { LocalfulEncryption } from "../encryption/encryption";
import {Logger} from "../../src/utils/logger";
import SharedNetworkWorker from "../worker/network.worker?sharedworker";

/**
 * Handles events throughout Localful, including communicating with
 * Localful instances in other browser contexts.
 *
 */
export class EventManager {
	eventTarget: EventTarget
	localBroadcastChannel: BroadcastChannel | undefined
	contextId: string
	private readonly sharedNetworkWorker: SharedWorker

	constructor() {
		this.eventTarget = new EventTarget()
		this.contextId = LocalfulEncryption.generateUUID()

		this.localBroadcastChannel = new BroadcastChannel("localful_events")
		this.localBroadcastChannel.onmessage = (message: MessageEvent<LocalfulEvent>) => {
			Logger.debug('[EventManager] Received broadcast channel message', message.data)
			this.dispatch(message.data.type, message.data.detail.data, message.data.detail.context)
		}

		this.sharedNetworkWorker = new SharedNetworkWorker()
		this.sharedNetworkWorker.port.start()
		this.sharedNetworkWorker.addEventListener('message', (event) => {
			const message  = event as MessageEvent<LocalfulEvent>
			Logger.debug('[EventManager] Received shared worker message', message.data)
			this.dispatch(message.data.type, message.data.detail.data, message.data.detail.context)
		})
	}

	dispatch<Event extends keyof EventMap>(type: Event, data: EventMap[Event]['detail']['data'], context?: EventContext) {
		const eventDetail = {
			context: context || {contextId: this.contextId},
			data: data,
		}

		Logger.debug(`[EventManager] Dispatching event:`, type, eventDetail)

		const event = new CustomEvent(type, { detail: eventDetail })
		this.eventTarget.dispatchEvent(event)

		// Only broadcast events to other instances and the shared worker if they originate in the current context,
		// otherwise hello infinite event ping pong!
		if (event.detail.context.contextId === this.contextId) {
			if (this.localBroadcastChannel) {
				// Don't send open/close events as that is unique to every instance.
				if (type !== EventTypes.DATABASE_OPEN && type !== EventTypes.DATABASE_CLOSE) {
					this.localBroadcastChannel.postMessage({ type, detail: eventDetail })
				}
			}

			this.sharedNetworkWorker.port.postMessage({type, data: eventDetail })
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
