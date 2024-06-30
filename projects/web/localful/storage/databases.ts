import {ActionResult, ErrorTypes, Query, QUERY_LOADING, QueryStatus} from "../control-flow";
import {LocalfulEncryption} from "../encryption/localful-encryption";
import {Observable} from "rxjs";
import {
	DatabaseChangeEvent,
	DatabaseLockEvent,
	DatabaseUnlockEvent,
	EventTypes
} from "../events/events";
import {IDBPDatabase, openDB} from "idb";
import {Logger} from "../../src/utils/logger";
import {LOCALFUL_INDEXDB_DATABASE_VERSION, LOCALFUL_VERSION} from "../localful-web";
import {LocalDatabaseDto, LocalDatabaseEntity, LocalDatabaseFields} from "../types/database";
import {EventManager} from "../events/event-manager";

export interface DatabaseStorageDependencies {
	eventManager: EventManager
}

type AnyDatabaseEvent =
	CustomEvent<DatabaseChangeEvent['detail']> |
	CustomEvent<DatabaseUnlockEvent['detail']> |
	CustomEvent<DatabaseLockEvent['detail']>

export class DatabaseStorage {
	private readonly _database?: IDBPDatabase
	private readonly eventManager: EventManager

	constructor(
		deps: DatabaseStorageDependencies
	) {
		this.eventManager = deps.eventManager
	}

	private async getIndexDbDatabase() {
		if (this._database) {
			return this._database
		}

		return openDB('localful', LOCALFUL_INDEXDB_DATABASE_VERSION, {
			// todo: handle upgrades to existing database versions
			upgrade: (db) => {
				// Create database store
				const entityStore = db.createObjectStore('databases', {
					keyPath: 'id',
					autoIncrement: false
				})
				entityStore.createIndex('isDeleted', 'isDeleted')
				entityStore.createIndex('createdAt', ['createdAt', 'isDeleted'])
				entityStore.createIndex('syncEnabled', ['syncEnabled', 'isDeleted'])
			},
		})
	}

	private async _createDto(entity: LocalDatabaseEntity): Promise<LocalDatabaseDto> {
		// todo: attempt to load encryption key, and set isUnlocked based on being able to load the key

		return {
			...entity,
			isUnlocked: true
		}
	}

	async unlockDatabase(id: string, password: string): Promise<boolean> {
		return false;
	}

	async lockDatabase(id: string): Promise<void> {
		return;
	}

	/**
	 * Get a single database
	 *
	 * @param id
	 */
	async get(id: string): Promise<ActionResult<LocalDatabaseDto>> {
		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readonly')
		const entity = await tx.objectStore('databases').get(id) as LocalDatabaseEntity|undefined
		if (!entity) {
			return {success: false, errors: [{type: ErrorTypes.DATABASE_NOT_FOUND, context: id}]}
		}
		await tx.done

		const dto = await this._createDto(entity)
		return {success: true, data: dto}
	}

	/**
	 * Create a new database.
	 *
	 * @param data
	 * @param password
	 */
	async create(data: LocalDatabaseFields, password: string): Promise<ActionResult<string>> {
		const db = await this.getIndexDbDatabase()

		const id = LocalfulEncryption.generateUUID();
		const timestamp = new Date().toISOString();

		// create encryptionKey
		// derive unlock key (KEK) from password
		// create protectedEncryptionKey, which is the encryptionKey encrypted with the unlock key

		const tx = db.transaction(['databases'], 'readwrite')

		const database: LocalDatabaseEntity = {
			id: id,
			name: data.name,
			protectedEncryptionKey: password,
			protectedData: undefined,
			createdAt: timestamp,
			updatedAt: timestamp,
			isDeleted: 0,
			localfulVersion: LOCALFUL_VERSION,
			syncEnabled: data.syncEnabled,
			lastSyncedAt: undefined
		}
		await tx.objectStore('databases').add(database)

		await tx.done

		this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: id, action: 'create'})

		return { success: true, data: id }
	}

	/**
	 * Update the given entity.
	 * This will load the latest version, apply the given updates, and create a
	 * new version with the updates.
	 *
	 * @param id
	 * @param dataUpdate
	 * @param preventEventDispatch - Useful in situations like data migrations, where an update is done while fetching data so an event shouldn't be triggered.
	 */
	async update(id: string, dataUpdate: Partial<LocalDatabaseFields>, preventEventDispatch?: boolean): Promise<ActionResult> {
		const currentDb = await this.get(id)
		if (!currentDb.success) return currentDb as ActionResult

		const timestamp = new Date().toISOString();

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readwrite')

		const newDatabase: LocalDatabaseEntity = {
			id: currentDb.data.id,
			protectedEncryptionKey: currentDb.data.protectedEncryptionKey,
			protectedData: currentDb.data.protectedData,
			createdAt: currentDb.data.createdAt,
			updatedAt: timestamp,
			isDeleted: currentDb.data.isDeleted,
			localfulVersion: currentDb.data.localfulVersion,
			lastSyncedAt: currentDb.data.lastSyncedAt,
			name: dataUpdate.name || currentDb.data.name,
			syncEnabled: dataUpdate.syncEnabled !== undefined
				? dataUpdate.syncEnabled
				: currentDb.data.syncEnabled,
		}
		await tx.objectStore('databases').put(newDatabase)

		await tx.done

		if (!preventEventDispatch) {
			this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: id, action: 'update' })
		}

		return {success: true, data: null}
	}

	/**
	 * Delete the given database on the local device and server, setting the 'isDeleted' flag
	 */
	async delete(id: string): Promise<ActionResult> {
		const currentDb = await this.get(id)
		if (!currentDb.success) return currentDb as ActionResult

		const timestamp = new Date().toISOString();

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readwrite')
		const entityStore = tx.objectStore('databases')

		const newDatabase: LocalDatabaseEntity = {
			id: currentDb.data.id,
			protectedEncryptionKey: currentDb.data.protectedEncryptionKey,
			protectedData: currentDb.data.protectedData,
			createdAt: currentDb.data.createdAt,
			updatedAt: timestamp,
			isDeleted: 1,
			localfulVersion: currentDb.data.localfulVersion,
			lastSyncedAt: currentDb.data.lastSyncedAt,
			name: currentDb.data.name,
			syncEnabled: currentDb.data.syncEnabled,
		}

		// The keypath 'id' is supplied, so no need to also supply this in the second arg
		await entityStore.put(newDatabase)

		await tx.done

		this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: id, action: 'delete' })

		return {success: true, data: null}
	}

	/**
	 * Delete the database locally but not on the server
	 *
	 * @param id
	 */
	async deleteLocal(id: string): Promise<ActionResult> {
		const currentDb = await this.get(id)
		if (!currentDb.success) return currentDb as ActionResult

		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readwrite')
		const entityStore = tx.objectStore('databases')

		await entityStore.delete(id)

		return { success: true, data: null }
	}

	/**
	 * Query for all databases.
	 */
	async query(): Promise<ActionResult<LocalDatabaseDto[]>> {
		const db = await this.getIndexDbDatabase()
		const tx = db.transaction(['databases'], 'readonly')

		const queryIndex = tx.objectStore('databases').index('isDeleted')

		const cursorResults: LocalDatabaseEntity[] = []
		for await (const entityCursor of queryIndex.iterate(0)) {
			const entity = entityCursor.value as LocalDatabaseEntity
			cursorResults.push(entity)
		}
		await tx.done

		const dtos: LocalDatabaseDto[] = []
		for (const entity of cursorResults) {
			const dto = await this._createDto(entity)
			dtos.push(dto)
		}

		return {
			success: true,
			data: dtos,
		}
	}

	/**
	 * Purge the given database, permanently deleting the database item and IndexDB database.
	 * This is different to just deletion, which will only delete the IndexDB database
	 * and set the 'isDeleted' flag.
	 *
	 * @param id
	 */
	async purge(id: string): Promise<ActionResult> {
		const db = await this.getIndexDbDatabase()

		indexedDB.deleteDatabase(`lf_${id}`)

		const tx = db.transaction(['databases'], 'readwrite')
		const entityStore = tx.objectStore('databases')
		await entityStore.delete(id)

		await tx.done

		this.eventManager.dispatch( EventTypes.DATABASE_CHANGE, { id: id, action: 'purge' })

		return {success: true, data: null}
	}

	liveGet(id: string) {
		return new Observable<Query<LocalDatabaseDto>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.get(id)
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = (e: AnyDatabaseEvent) => {
				// Discard if tableKey or ID doesn't match, as the data won't have changed.
				if (e.detail.data.id === id && e.detail.data.id === id) {
					Logger.debug(`[observableGet] Received event that requires re-query`)
					runQuery()
				}
			}

			this.eventManager.subscribe(EventTypes.DATABASE_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_UNLOCK, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_LOCK, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATABASE_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_UNLOCK, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_LOCK, handleEvent)
			}
		})
	}

	liveQuery() {
		return new Observable<Query<LocalDatabaseDto[]>>((subscriber) => {
			subscriber.next(QUERY_LOADING)

			const runQuery = async () => {
				subscriber.next(QUERY_LOADING)

				const result = await this.query()
				if (result.success) {
					subscriber.next({status: QueryStatus.SUCCESS, data: result.data, errors: result.errors})
				}
				else {
					subscriber.next({status: QueryStatus.ERROR, errors: result.errors})
				}
			}

			const handleEvent = () => {
				runQuery()
			}

			this.eventManager.subscribe(EventTypes.DATABASE_CHANGE, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_UNLOCK, handleEvent)
			this.eventManager.subscribe(EventTypes.DATABASE_LOCK, handleEvent)

			// Run initial query
			runQuery()

			return () => {
				this.eventManager.unsubscribe(EventTypes.DATABASE_CHANGE, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_UNLOCK, handleEvent)
				this.eventManager.unsubscribe(EventTypes.DATABASE_LOCK, handleEvent)
			}
		})
	}
}
