import {z} from "zod"

export const IdField = z.string().uuid()
export type IdField = z.infer<typeof IdField>

// IndexDB can't index boolean types, so 0 and 1 must be used instead.
export const IsDeletedField = z.union([z.literal(0), z.literal(1)])
export type IsDeletedField = z.infer<typeof IsDeletedField>

export const TimestampField = z.string().datetime()
export type TimestampField = z.infer<typeof TimestampField>

/**
 * An entity is the base of all storable data.
 * All stored data is immutable and actual data is stores in version tables,
 * which means top-level entities only need to store basic id and timestamp data.
 */
export const Entity = z.object({
  id: IdField,
  isDeleted: IsDeletedField,
  createdAt: TimestampField,
  localfulVersion: z.string(),
}).strict()
export type Entity = z.infer<typeof Entity>

export const LocalEntity = Entity.extend({
  currentVersionId: z.string().uuid().optional()
}).strict()
export type LocalEntity = z.infer<typeof LocalEntity>

/**
 * An entity version is where actual data is stored.
 * When an entity needs to be updated, a new version of that entity is created.
 * The 'createdAt' field of a version can then be used to identify the latest version.
 */
export const EntityVersion = z.object({
  entityId: IdField,
  id: IdField,
  createdAt: TimestampField,
  // All actual data is encrypted, so stored data will always be ciphertext string
  data: z.string(),
  localfulVersion: z.string(),
  schemaVersion: z.string()
}).strict()
export type EntityVersion = z.infer<typeof EntityVersion>

/**
 * While data is stored in versions, most of the time it's only required to
 * load the current version. The entity dto is the building block for building
 * these return types.
 */
export const EntityDtoBase = z.object({
  id: IdField,
  versionId: IdField,
  // This will be the entity createdAt field
  createdAt: TimestampField,
  // This will be the version createdAt field,
  // which conceptually is the updated timestamp
  updatedAt: TimestampField
})
export type EntityDtoBase = z.infer<typeof EntityDtoBase>

/**
 * A dto type with the added data schema.
 */
export interface EntityDto<DataSchema> extends EntityDtoBase {
  data: DataSchema
}

export type EntityUpdate<T> = Partial<T>
