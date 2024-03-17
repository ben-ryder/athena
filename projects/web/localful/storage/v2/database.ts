import { DatabaseTable } from "./table";
import { DBSchema } from "idb";

export interface AthenaIDB extends DBSchema {
	tags: {
		key: string
		value: {
			name: string
			colourVariant: string
		}
	}
	fields: {
		key: string
		value: {
			name: string
			colourVariant: string
		}
	}
}

export class Database {
	tags: DatabaseTable
	fields: DatabaseTable
	contentTypes: DatabaseTable
	content: DatabaseTable
	views: DatabaseTable

	getDb()
}
