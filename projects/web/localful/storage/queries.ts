import {CurrentSchemaData, CurrentSchemaExposedFields, DataSchemaDefinition, TableKeys} from "./database";

export type EqualFilter = {
	operation: 'equal',
	value: string | number
}

export type RangeFilter = {
	operation: 'range',
	lowerValue?: string | number,
	upperValue?: string | number,
	includeLowerValue?: boolean
	includeUpperValue?: boolean
}

export type LikeFilter = {
	operation: 'like',
	value: string
}

export type IncludesFilter = {
	operation: 'includes',
	value: (string | number)[]
}

export type IndexFilters = EqualFilter | RangeFilter | IncludesFilter

export type DataFilters = EqualFilter | RangeFilter | IncludesFilter | LikeFilter

export type DataWhereOption<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends TableKeys<DataSchema>
> = {
	field: keyof CurrentSchemaData<DataSchema, EntityKey>,
} & DataFilters

export type DataWhereOptions<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends TableKeys<DataSchema>
> = DataWhereOption<DataSchema, EntityKey>[] | DataWhereOption<DataSchema, EntityKey>[][]

export type IndexWhereOption<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends TableKeys<DataSchema>
> = {
	field: CurrentSchemaExposedFields<DataSchema, EntityKey>
} & IndexFilters

export interface QueryDefinition<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends TableKeys<DataSchema>
> {
	table: EntityKey
	index?: IndexWhereOption<DataSchema, EntityKey>
	where?: DataWhereOptions<DataSchema, EntityKey>
	groupBy?: keyof CurrentSchemaData<DataSchema, EntityKey>
	orderBy?: keyof CurrentSchemaData<DataSchema, EntityKey>
	orderDirection?: 'asc' | 'desc'
}
