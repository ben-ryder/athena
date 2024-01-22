import * as WebCrypto from "easy-web-crypto";
import {ZodTypeAny} from "zod";
import {Dexie} from "dexie";
import {EntityTable} from "./storage/entity-table";
import {Entity, EntityDto, EntityVersion} from "../src/state/schemas/common/entity";
import {EventTypes} from "./events/events";

export interface MigrationMeta {
	currentVersion: string
	targetVersion: string
}

export type DataMigrations<CurrentData, ResultData> = (localful: LocalfulWeb, meta: MigrationMeta, data: CurrentData) => Promise<ResultData|null>

export interface DataSchema {
	[key: string]: {
		version: string
		schema: ZodTypeAny
		migrations?: DataMigrations<never, never>
		useMemoryCache?: boolean
	}
}

export interface LocalfulWebConfig {
	initialDatabaseId?: string
	dataSchema: DataSchema
}

export const LOCALFUL_VERSION = Object.freeze(1)

const ENTITY_INDEXED_FIELDS = ['id', 'isDeleted'] as const
const VERSION_INDEXED_FIELDS = ['id', 'entityId'] as const

export const EXAMPLE_VAULT_ID = 'C68EF132-75F3-456A-B43C-89F662B79A19'

export class LocalfulWeb {
	currentDatabaseId: string
	events: EventTarget
	dataSchema: DataSchema

	private _db: Dexie | undefined
	private entityTables: {
		[key: string]: EntityTable<never, never, never, never>
	}
	private dexieTables: {
		[key: string]: string
	}

	constructor(config: LocalfulWebConfig) {
		this.currentDatabaseId = EXAMPLE_VAULT_ID

		this.events = new EventTarget()

		this.dataSchema = config.dataSchema

		this.dexieTables = {}
		for (const entityKey of Object.keys(config.dataSchema)) {
			const versionTableName = `${entityKey}_versions`
			// @ts-ignore
			dexieTables[entityKey] = ENTITY_INDEXED_FIELDS.join(",")
			// @ts-ignore
			dexieTables[versionTableName] = VERSION_INDEXED_FIELDS.join(",")
		}

		if (config.initialDatabaseId) {
			this.setCurrentVault(config.initialDatabaseId)
		}

		this.entityTables = {}
		for (const [entityKey, entityData] of Object.entries(config.dataSchema)) {
			this.entityTables[entityKey] = new EntityTable(this, {
				entityTable: entityKey,
				versionTable: `${entityKey}_versions`,
				dataSchema: entityData.schema,
				currentSchemaVersion: entityData.version,
				useMemoryCache: entityData.useMemoryCache || false
			})
		}
	}

	db<EntitySchema extends Entity, VersionSchema extends EntityVersion, DataSchema, DtoSchema extends EntityDto>(entityKey: string): EntityTable<EntitySchema, VersionSchema, DataSchema, DtoSchema> {
		return this.entityTables[entityKey]
	}

	async getCurrentDatabase(): Promise<Dexie> {
		if (this._db && this._db.name === this.currentDatabaseId) {
			return this._db
		}
		else if (this._db && this._db.name !== this.currentDatabaseId) {
			this._db.close()
		}

		if (!this.currentDatabaseId) {
			throw Error("Attempted to use current database when no database is selected")
		}

		this._db = new Dexie(this.currentDatabaseId)
		this._db.version(LOCALFUL_VERSION).stores(this.dexieTables)
		return this._db
	}

	setCurrentVault(databaseId: string) {
		this.currentDatabaseId = databaseId

		const event = new CustomEvent(EventTypes.DATABASE_SWITCH)
		this.events.dispatchEvent(event)
	}

	getCurrentVault() {
		return this.currentDatabaseId
	}

	async getEncryptionKey(): Promise<CryptoKey> {
		const passphrase = "super secure passphrase"
		const encMasterKey = {"derivationParams":{"salt":"817004d86c216356b62cd3974342201b","iterations":100000,"hashAlgo":"SHA-256"},"encryptedMasterKey":{"ciphertext":"397fe7cade63bf6a893151636a1516307b03dd6b7fb79c5ed46db926bc69a9bf38607d1e598d3910a8eb75a808d20b89b64bc17ddd9f9abac7d7e8b5294bedb3b437f569e639676087907db56a6874a91bab","iv":"94ac25b2fd7a130c7ce27e7c"}}
		return WebCrypto.decryptMasterKey(passphrase, encMasterKey)
	}
}
