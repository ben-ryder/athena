import {z} from "zod"
import { CreatedAtField, IdField, IsDeletedField, UpdatedAtField } from "./fields";

/**
 * An entity is the base of all storable data.
 * All stored data is immutable and actual data is stores in version tables,
 * which means top-level entities only need to store basic id and timestamp data.
 */
export const Entity = z.object({
  id: IdField,
  isDeleted: IsDeletedField,
  createdAt: CreatedAtField,
}).strict()
export type Entity = z.infer<typeof Entity>

/**
 * An entity version is where actual data is stored.
 * When an entity needs to be updated, a new version of that entity is created.
 * The 'createdAt' field of a version can then be used to identify the latest version.
 */
export const EntityVersion = z.object({
  id: IdField,
  createdAt: CreatedAtField,
  // All actual data is encrypted, so stored data will always be ciphertext string
  data: z.string()
}).strict()
export type EntityVersion = z.infer<typeof EntityVersion>

/**
 * While data is stored in versions, most of the time it's only required to
 * load the current version. The entity dto is the building block for building
 * these return types.
 */
export const EntityDto = z.object({
  id: IdField,
  isDeleted: IsDeletedField,
  versionId: IdField,
  // This will be the entity createdAt field
  createdAt: CreatedAtField,
  // This will be the version createdAt field,
  // which conceptually is the updated timestamp
  updatedAt: UpdatedAtField
})
export type EntityDto = z.infer<typeof EntityDto>

export type EntityUpdate<T> = Partial<T>
