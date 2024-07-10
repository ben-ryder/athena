import { EntityDatabase } from "./storage/entity-database/entity-database";
import { EventManager } from "./events/event-manager";
import {DataSchemaDefinition} from "./storage/types";
import {LocalDatabaseFields} from './types/database'
import {DatabaseStorage} from "./storage/databases";
import {KeyStorage} from "./storage/key-storage";

export const LOCALFUL_VERSION = '1.0'
export const LOCALFUL_INDEXDB_ENTITY_VERSION = 1
export const LOCALFUL_INDEXDB_DATABASE_VERSION = 1


export interface LocalfulWebConfig {
	dataSchema: DataSchemaDefinition
}

export class LocalfulWeb<DataSchema extends DataSchemaDefinition> {
	private readonly eventManager: EventManager
	private readonly dataSchema: DataSchemaDefinition
	private readonly databaseStorage: DatabaseStorage

	constructor(config: LocalfulWebConfig) {
		this.eventManager = new EventManager()
		this.dataSchema = config.dataSchema
		this.databaseStorage = new DatabaseStorage({eventManager: this.eventManager})
	}

	async openDatabase(databaseId: string) {
		// Ensure that the database exists before opening the database.
		await this.getDatabase(databaseId)

		// todo: encryptionKey and database.isUnlocked is separate. could this cause issues as they might get out of sync?
		const encryptionKey = await KeyStorage.get(databaseId)
		if (!encryptionKey) {
			return null
		}

		return new EntityDatabase<DataSchema>({
			databaseId: databaseId,
			encryptionKey,
			dataSchema: this.dataSchema
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
}
