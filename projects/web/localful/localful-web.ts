import * as WebCrypto from "easy-web-crypto";
import { EntityDatabase } from "./storage/entity-database";
import { EventManager } from "./events/event-manager";
import {DataSchemaDefinition} from "./storage/types";
import {LocalDatabaseFields} from './types/database'
import {DatabaseStorage} from "./storage/databases";

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
		// todo: check databaseIdd is valid?
		// todo: check database is unlocked?
		// todo: don't allow deleted database to be opened

		const passphrase = "super secure passphrase"
		const encMasterKey = {"derivationParams":{"salt":"817004d86c216356b62cd3974342201b","iterations":100000,"hashAlgo":"SHA-256"},"encryptedMasterKey":{"ciphertext":"397fe7cade63bf6a893151636a1516307b03dd6b7fb79c5ed46db926bc69a9bf38607d1e598d3910a8eb75a808d20b89b64bc17ddd9f9abac7d7e8b5294bedb3b437f569e639676087907db56a6874a91bab","iv":"94ac25b2fd7a130c7ce27e7c"}}
		const encryptionKey = await WebCrypto.decryptMasterKey(passphrase, encMasterKey)

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
}
