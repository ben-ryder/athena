import {CurrentSchemaData, CurrentSchemaExposedFields, DataSchemaDefinition, TableKeys} from "./database";
import {z} from "zod";

export type EqualFilter = {
	operation: 'equal',
	value: string | number
}

export type RangeFilter = {
	operation: 'range',
	greaterThan?: string | number,
	lessThan?: string | number,
	greaterThanEqualTo?: string | number,
	lessThanEqualTo?: string | number,
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

export type BuiltInFilterableFields = 'createdAt' | 'updatedAt'

export type DataWhereOption<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends TableKeys<DataSchema>
> = ({
	field: (keyof z.infer<CurrentSchemaData<DataSchema, EntityKey>>) | BuiltInFilterableFields,
} | {
	fieldPath: string
}) & DataFilters

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
