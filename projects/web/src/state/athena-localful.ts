import {LocalfulWeb} from "../../localful/localful-web";
import {TagData} from "./schemas/tags/tags";
import {FieldDefinition} from "./schemas/fields/fields";
import {ContentTypeData} from "./schemas/content-types/content-types";
import {ContentData} from "./schemas/content/content";

export const localful = new LocalfulWeb({
	initialDatabaseId: 'vault_d7ef8db9-e401-4971-93e2-156d94a0a8d2',
	dataSchema: {
		tags: {
			version: "1",
			schema: TagData,
			useMemoryCache: false,
		},
		fields: {
			version: "1",
			schema: FieldDefinition,
			useMemoryCache: false,
		},
		content_types: {
			version: "1",
			schema: ContentTypeData,
			useMemoryCache: false,
		},
		content: {
			version: "1",
			schema: ContentData,
			useMemoryCache: false,
		},
	}
})

window.athenaLocalful = localful
