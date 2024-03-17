
export interface BaseEntity {
	id: string,
	isDeleted: 0 | 1,
	createdAt: string,
	localfulVersion: string,
}

export interface BaseLocalEntity extends BaseEntity {
	currentVersionId: string,
}

export interface BaseVersion {
	entityId: string
	id: string,
	createdAt: string,
	localfulVersion: string,
	schemaVersion: string
}

export interface BaseDto extends BaseEntity {
	versionId: string
	updatedAt: string
}
