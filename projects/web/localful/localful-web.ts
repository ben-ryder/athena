import * as WebCrypto from "easy-web-crypto";
import { LocalfulDatabase } from "./storage/database";
import { EventManager } from "./events/event-manager";
import {DataSchemaDefinition} from "@localful-athena/storage/types";

export interface LocalfulWebConfig {
	initialDatabaseId?: string
	dataSchema: DataSchemaDefinition
}

export class LocalfulWeb<DataSchema extends DataSchemaDefinition> {
	eventManager: EventManager
	readonly db: LocalfulDatabase<DataSchema>

	constructor(config: LocalfulWebConfig) {
		this.eventManager = new EventManager()

		this.db = new LocalfulDatabase<DataSchema>({
			dataSchema: config.dataSchema,
			getEncryptionKey: this.getEncryptionKey,
			eventManager: this.eventManager
		})

		if (config.initialDatabaseId) {
			this.db.setCurrentVault(config.initialDatabaseId)
		}
	}

	async getEncryptionKey(databaseId: string): Promise<CryptoKey> {
		const passphrase = "super secure passphrase"
		const encMasterKey = {"derivationParams":{"salt":"817004d86c216356b62cd3974342201b","iterations":100000,"hashAlgo":"SHA-256"},"encryptedMasterKey":{"ciphertext":"397fe7cade63bf6a893151636a1516307b03dd6b7fb79c5ed46db926bc69a9bf38607d1e598d3910a8eb75a808d20b89b64bc17ddd9f9abac7d7e8b5294bedb3b437f569e639676087907db56a6874a91bab","iv":"94ac25b2fd7a130c7ce27e7c"}}
		return WebCrypto.decryptMasterKey(passphrase, encMasterKey)
	}
}
