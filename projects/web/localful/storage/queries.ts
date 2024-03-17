import { CurrentSchema, DataSchemaDefinition, EntityKeys } from "./database";

export interface WhereOption<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends EntityKeys<DataSchema>
> {
	field: keyof CurrentSchema<DataSchema, EntityKey>,
	operation: 'equal' | 'like' | 'greater' | 'less',
	value: never
}

export type WhereOptions<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends EntityKeys<DataSchema>
> = WhereOption<DataSchema, EntityKey>[] | WhereOption<DataSchema, EntityKey>[][]

export interface Query<
	DataSchema extends DataSchemaDefinition,
	EntityKey extends EntityKeys<DataSchema>
> {
	from: EntityKey
	where: WhereOptions<DataSchema, EntityKey>
	groupBy?: keyof CurrentSchema<DataSchema, EntityKey>
	orderBy: keyof CurrentSchema<DataSchema, EntityKey>
	orderDirection?: 'asc' | 'desc'
}



