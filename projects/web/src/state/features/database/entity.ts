export interface Entity {
	id: string;
	createdAt: string;
	updatedAt: string;
}

export interface EntityTable<T> {
	entities: { [key: string]: T };
	ids: string[];
}

export type EntityWithoutId<T> = Omit<T, "id">;
