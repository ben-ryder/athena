
export type LocalNetworkListener<T> = (data: T) => Promise<void>

export interface LocalNetworkListenerStore {
  [key: string]: LocalNetworkListener<any>[]
}

export class LocalNetwork {
  browserChannel: BroadcastChannel;
  listenerStore: LocalNetworkListenerStore;

  constructor() {
    this.browserChannel = new BroadcastChannel("localful");
    this.listenerStore = {};

    this.browserChannel.onmessage = (event: MessageEvent) => {
      if (event.data?.type && event.data.data) {
        this.callListeners(event.data.type, event.data.data);
      }
    };
  }

  private async callListeners(key: string, data: any) {
    const knownEvents = Object.keys(this.listenerStore)
    if (knownEvents.includes(key)) {
      const listeners = this.listenerStore[key]
      if (Array.isArray(listeners)) {
        for (const listener of listeners) {
          await listener(data);
        }
      }
    }
  }

  emitEvent(key: string, data: any) {
    this.browserChannel.postMessage({type: key, data: data});
  }

  addListener<T>(key: string, listener: LocalNetworkListener<T>) {
    if (typeof this.listenerStore[key] !== 'undefined' && Array.isArray(this.listenerStore[key])) {
      // @ts-ignore
      this.listenerStore[key].push(listener);
    }
    else {
      this.listenerStore[key] = [listener]
    }
  }
}
