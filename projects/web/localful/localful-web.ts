import * as WebCrypto from "easy-web-crypto";
import { EntityDatabase } from "./storage/entity-database";
import { EventManager } from "./events/event-manager";
import {DataSchemaDefinition} from "@localful-athena/storage/types";
import { DatabaseFields } from './types/database'

export interface LocalfulWebConfig {
	dataSchema: DataSchemaDefinition
}

export class LocalfulWeb<DataSchema extends DataSchemaDefinition> {
	private readonly eventManager: EventManager
	private readonly dataSchema: DataSchemaDefinition

	constructor(config: LocalfulWebConfig) {
		this.eventManager = new EventManager()
		this.dataSchema = config.dataSchema
	}

	async openDatabase(databaseId: string) {
		// todo: check databaseIdd is valid?
		// todo: check database is unlocked?

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

	createDatabase() {

	}

	getDatabase(id: string) {

	}

	updateDatabase(id: string, updatedVault: Partial<DatabaseFields>) {

	}

	deleteDatabase(id: string) {
		// todo: handle if database doesn't exist?
		indexedDB.deleteDatabase(id)
	}

	queryDatabases() {

	}

	liveGetDatabase(id: string) {

	}

	liveQueryDatabase() {

	}
}
