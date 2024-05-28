import { LocalfulDatabase } from "./database";
import {EntityDto, EntityVersion, LocalEntity} from "../types/data-entities";
import {z, ZodTypeAny} from "zod";
import {IDBPIndex} from "idb";

export type EqualFilter = {
	operation: 'equal',
	value: string | number
}

export type RangeFilter = {
	operation: 'range',
	greaterThan?: string | number,
	greaterThanEqualTo?: string | number,
	lessThan?: string | number,
	lessThanEqualTo?: string | number,
}

// export type LikeFilter = {
// 	operation: 'like',
// 	value: string
// }

export type IncludesFilter = {
	operation: 'includes',
	value: (string | number)[]
}

export type IndexFilters = EqualFilter | RangeFilter | IncludesFilter

// export type DataFilters = EqualFilter | RangeFilter | IncludesFilter // | LikeFilter

// export type BuiltInFilterableFields = 'createdAt' | 'updatedAt'

// export type DataWhereOption<
// 	DataSchema extends DataSchemaDefinition,
// 	EntityKey extends TableKeys<DataSchema>
// > = ({
// 	field: (keyof z.infer<CurrentSchemaData<DataSchema, EntityKey>>) | BuiltInFilterableFields,
// } | {
// 	fieldPath: string
// }) & DataFilters
//
// export type DataWhereOptions<
// 	DataSchema extends DataSchemaDefinition,
// 	EntityKey extends TableKeys<DataSchema>
// > = DataWhereOption<DataSchema, EntityKey>[] | DataWhereOption<DataSchema, EntityKey>[][]

export type IndexWhereOption<
	DataSchema extends DataSchemaDefinition,
	TableKey extends TableKeys<DataSchema>
> = {
	field: CurrentSchemaExposedFields<DataSchema, TableKey>
} & IndexFilters

export type WhereCursor<
	DataSchema extends DataSchemaDefinition,
	TableKey extends TableKeys<DataSchema>
> = (
	entity: LocalEntityWithExposedFields<DataSchema, TableKey>,
	version: EntityVersion,
) => boolean

export type WhereData<
	DataSchema extends DataSchemaDefinition,
	TableKey extends TableKeys<DataSchema>
> = (entityDto: EntityDto<CurrentSchemaData<DataSchema, TableKey>>) => boolean

export interface QueryDefinition<
	DataSchema extends DataSchemaDefinition,
	TableKey extends TableKeys<DataSchema>
> {
	table: TableKey
	index?: IndexWhereOption<DataSchema, TableKey>
	whereCursor?: WhereCursor<DataSchema, TableKey>
	whereData?: WhereData<DataSchema, TableKey>
	sort?: (entityDto: EntityDto<CurrentSchemaData<DataSchema, TableKey>>[]) => EntityDto<CurrentSchemaData<DataSchema, TableKey>>[],
}

// Type helper to access entity keys
export type TableKeys<DataSchema extends DataSchemaDefinition> = keyof DataSchema['tables'] & string

// Type helper to access the schema keys of a given table
export type SchemaKeys<DataSchema extends DataSchemaDefinition, TableKey extends TableKeys<DataSchema>> = keyof DataSchema['tables'][TableKey]['schemas']

// Type helper to access a specific schema for the given table and schema version
export type SchemaVersion<DataSchema extends DataSchemaDefinition, TableKey extends TableKeys<DataSchema>, SchemaVersion extends keyof DataSchema['tables'][TableKey]['schemas']> = DataSchema['tables'][TableKey]['schemas'][SchemaVersion]

// Type helper to access the current schema version for a given table
export type CurrentSchemaData<DataSchema extends DataSchemaDefinition, TableKey extends TableKeys<DataSchema>> = z.infer<SchemaVersion<DataSchema, TableKey, DataSchema['tables'][TableKey]['currentSchema']>['data']>

// Type helper to access the current schema version for a given table
export type CurrentSchemaExposedFields<DataSchema extends DataSchemaDefinition, TableKey extends TableKeys<DataSchema>> = keyof SchemaVersion<DataSchema, TableKey, DataSchema['tables'][TableKey]['currentSchema']>['exposedFields']

// Type helper to access the local entity type with exposed fields added
export type LocalEntityWithExposedFields<DataSchema extends DataSchemaDefinition, TableKey extends TableKeys<DataSchema>> = LocalEntity & Pick<CurrentSchemaData<DataSchema, TableKey>, CurrentSchemaExposedFields<DataSchema, TableKey>>

export type DataMigration<
	DataSchema extends DataSchemaDefinition,
	TableKey extends TableKeys<DataSchema>,
	CurrentSchemaKey extends SchemaKeys<DataSchema, TableKey>,
	TargetSchemaKey extends SchemaKeys<DataSchema, TableKey>,
> = (
	db: LocalfulDatabase<DataSchema>,
	currentSchema: CurrentSchemaKey, targetSchema: TargetSchemaKey,
	data: SchemaVersion<DataSchema, TableKey, CurrentSchemaKey>
) => Promise<SchemaVersion<DataSchema, TableKey, TargetSchemaKey>>

export interface DataSchemaDefinition {
	// The IndexDB database version.
	version: number,
	tables: {
		[key: string]: {
			currentSchema: string
			schemas: {
				[key: string]: {
					data: ZodTypeAny
					exposedFields?: ExposedFieldsDefinition
				}
			}
			migrateSchema?: DataMigration<never, never, never, never>
			useMemoryCache?: boolean
		}
	}
}

export interface ExposedFieldsDefinition {
	[key: string]: 'indexed' | 'plain'
}

export interface QueryIndex {
	index: IDBPIndex
	query?: IDBKeyRange | IDBValidKey | null,
	direction?: IDBCursorDirection
}
