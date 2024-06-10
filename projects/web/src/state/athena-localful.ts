import {TagData} from "./schemas/tags/tags";
import {FieldDefinition} from "./schemas/fields/fields";
import {ContentTypeData} from "./schemas/content-types/content-types";
import {ContentData} from "./schemas/content/content";
import {ViewData} from "./schemas/views/views";

export const DATA_SCHEMA = {
	version: 1.1,
	tables: {
		tags: {
			currentSchema: 'v1',
			schemas: {
				v1: {data: TagData}
			},
			useMemoryCache: true,
		},
		fields: {
			currentSchema: 'v1',
			schemas: {
				v1: {data: FieldDefinition}
			},
			useMemoryCache: true,
		},
		content_types: {
			currentSchema: 'v1',
			schemas: {
				v1: {
					data: ContentTypeData,
					exposedFields: {fields: 'plain', contentTemplateTags: 'plain'}
				}
			},
			useMemoryCache: true,
		},
		content: {
			currentSchema: 'v1',
			schemas: {
				v1: {
					data: ContentData,
					exposedFields: {type: 'indexed', tags: 'plain', isFavourite: 'plain'}
				},
			},
			useMemoryCache: false,
		},
		views: {
			currentSchema: 'v1',
			schemas: {
				v1: {
					data: ViewData,
					exposedFields: {isFavourite: 'plain', tags: 'plain', queryTags: 'plain', queryContentTypes: 'plain'}
				},
			},
			useMemoryCache: false,
		}
	},
} as const
export type DATA_SCHEMA = typeof DATA_SCHEMA
