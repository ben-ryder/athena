import {LocalfulWeb} from "../../localful/localful-web";
import {TagData} from "./schemas/tags/tags";
import {FieldDefinition} from "./schemas/fields/fields";
import {ContentTypeData} from "./schemas/content-types/content-types";
import {ContentData} from "./schemas/content/content";

export const DATA_SCHEMA = {
	tags: {
		version: "1",
		currentSchema: 'v1',
		schemas: {
			v1: TagData
		},
		useMemoryCache: false,
	},
	fields: {
		version: "1",
		currentSchema: 'v1',
		schemas: {
			v1: FieldDefinition
		},
		useMemoryCache: false,
	},
	content_types: {
		version: "1",
		currentSchema: 'v1',
		schemas: {
			v1: ContentTypeData
		},
		useMemoryCache: false,
	},
	content: {
		version: "1",
		currentSchema: 'v1',
		schemas: {
			v1: ContentData
		},
		useMemoryCache: false,
	},
} as const

export const localful = new LocalfulWeb<typeof DATA_SCHEMA>({
	initialDatabaseId: 'vault_d7ef8db9-e401-4971-93e2-156d94a0a8d2',
	dataSchema: DATA_SCHEMA
})

// Added for dev debugging purposes
// todo: remove this
// @ts-expect-error - custom
window.athenaLocalful = localful
