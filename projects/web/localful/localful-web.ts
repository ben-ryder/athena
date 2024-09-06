import {EntityDatabase, EntityDatabaseConfig} from "./storage/entity-database/entity-database";
import { EventManager } from "./events/event-manager";
import {TableSchemaDefinitions, TableTypeDefinitions} from "./storage/types/types";
import {LocalDatabaseFields} from './types/database'
import {DatabaseStorage} from "./storage/databases";
import {KeyStorage} from "./storage/key-storage";
import {EventTypes, LocalfulEvent} from "./events/events";
import {Observable} from "rxjs";
import {LIVE_QUERY_LOADING_STATE, LiveQueryResult, LiveQueryStatus} from "./control-flow";
import SharedNetworkWorker from "./worker/network.worker?sharedworker";
import {Logger} from "../src/utils/logger";

export const LOCALFUL_VERSION = '1.0'
export const LOCALFUL_INDEXDB_ENTITY_VERSION = 1
export const LOCALFUL_INDEXDB_DATABASE_VERSION = 1


export interface LocalfulWebConfig<
	TableTypes extends TableTypeDefinitions,
> {
	tableSchemas: EntityDatabaseConfig<TableTypes>['tableSchemas']
}

export type SyncStatus = 'synced' | 'queued' | 'running' | 'error' | 'disabled'

export class LocalfulWeb<
	TableTypes extends TableTypeDefinitions,
	TableSchemas extends TableSchemaDefinitions<TableTypes>
> {
	private readonly tableSchemas: TableSchemaDefinitions<TableTypes>
	private readonly databaseStorage: DatabaseStorage

	private readonly eventManager: EventManager
	private readonly sharedNetworkWorker: SharedWorker

	/**
	 * Synchronisation is managed by the SharedNetworkWorker which then dispatches messages when the sync status
	 * changes or a sync message occurs.
	 */
	private readonly lastKnownSyncStatus: SyncStatus
	private readonly syncMessages: string[]

	constructor(config: LocalfulWebConfig<TableTypes>) {
		this.eventManager = new EventManager()
		this.sharedNetworkWorker = new SharedNetworkWorker()
		this.sharedNetworkWorker.port.start()

		this.tableSchemas = config.tableSchemas
		this.databaseStorage = new DatabaseStorage({eventManager: this.eventManager})

		// Set up a listener to relay all messages from the shared worker to the event manager.
		this.sharedNetworkWorker.addEventListener('message', (event) => {
			const message  = event as MessageEvent<LocalfulEvent>
			Logger.debug('[LocalfulWeb] Received shared worker message', message.data)
			this.eventManager.dispatch(message.data.type, message.data.detail.data, message.data.detail.context)
		})

		// Set up a listener to relay all messages from the event manager to the shared worker.
		this.eventManager.subscribeAll((e: CustomEvent<LocalfulEvent>) => {
			this.sharedNetworkWorker.port.postMessage({type: e.type , data: e.detail })
		})

		this.syncMessages = []
		this.lastKnownSyncStatus = 'disabled'
	}

	async openDatabase(databaseId: string) {
		// Ensure that the database exists before opening the database.
		await this.getDatabase(databaseId)

		// todo: encryptionKey and database.isUnlocked is separate. could this cause issues as they might get out of sync?
		const encryptionKey = await KeyStorage.get(databaseId)
		if (!encryptionKey) {
			return null
		}

		this.eventManager.dispatch(EventTypes.DATABASE_OPEN, {id: databaseId})

		return new EntityDatabase<TableTypes, TableSchemas>({
			databaseId: databaseId,
			encryptionKey,
			tableSchemas: this.tableSchemas
		}, {
			eventManager: this.eventManager
		})
	}

	createDatabase(data: LocalDatabaseFields, password: string) {
		return this.databaseStorage.create(data, password)
	}

	getDatabase(id: string) {
		return this.databaseStorage.get(id)
	}

	updateDatabase(id: string, updatedVault: Partial<LocalDatabaseFields>) {
		return this.databaseStorage.update(id, updatedVault)
	}

	deleteDatabase(id: string) {
		return this.databaseStorage.delete(id)
	}

	deleteLocalDatabase(id: string) {
		return this.databaseStorage.deleteLocal(id)
	}

	queryDatabases() {
		return this.databaseStorage.query()
	}

	liveGetDatabase(id: string) {
		return this.databaseStorage.liveGet(id)
	}

	liveQueryDatabase() {
		return this.databaseStorage.liveQuery()
	}

	unlockDatabase(id: string, password: string) {
		return this.databaseStorage.unlockDatabase(id, password)
	}

	lockDatabase(id: string) {
		return this.databaseStorage.lockDatabase(id)
	}

	changeDatabasePassword(databaseId: string, currentPassword: string, newPassword: string) {
		return this.databaseStorage.changeDatabasePassword(databaseId, currentPassword, newPassword)
	}

	getStoragePermission(): Promise<boolean> {
		return navigator.storage.persisted()
	}

	liveGetStoragePermission(): Observable<LiveQueryResult<boolean>> {
		return new Observable<LiveQueryResult<boolean>>((subscriber) => {
			subscriber.next(LIVE_QUERY_LOADING_STATE)

			const runQuery = async () => {
				subscriber.next(LIVE_QUERY_LOADING_STATE)

				try {
					const isGranted = await this.getStoragePermission()
					subscriber.next({status: LiveQueryStatus.SUCCESS, result: isGranted})
				}
				catch (e) {
					subscriber.next({status: LiveQueryStatus.ERROR, errors: [e]})
				}
			}

			const handleEvent = () => {
				runQuery()
			}

			this.eventManager.subscribe(EventTypes.STORAGE_PERMISSION, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.STORAGE_PERMISSION, handleEvent)
			}
		})
	}

	async requestStoragePermissions() {
		const result = await navigator.storage.persist()
		this.eventManager.dispatch('storage-permission', {isGranted: result})
	}
}
