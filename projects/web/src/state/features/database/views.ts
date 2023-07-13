import { Entity, EntityTable } from "./entity";

/**
 * Views
 * ========================
 */
export enum ViewOrderByFields {
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	NAME = "name",
}
export enum ViewOrderDirection {
	ASC = "asc",
	DESC = "desc",
}

export interface ViewContent {
	name: string;
	tags: string[];
	orderBy: ViewOrderByFields;
	orderDirection: ViewOrderDirection;
	limit: number;
}

export interface ViewEntity extends Entity, ViewContent {}
export interface ViewsTable extends EntityTable<ViewEntity> {}
