import {z} from "zod"
import {IdField} from "./fields";

export const Entity = z.object({
  id: IdField,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Entity = z.infer<typeof Entity>

export interface GenericTable<Entity> {
  entities: {[key: string]: Entity}
  ids: string[]
}

export function createEntityTable<Entity>(entity: z.ZodType<Entity>) {
  return z.object({
    entities: z.record(z.string().uuid(), entity),
    ids: z.array(IdField)
  })
}

export type EntityWithoutId<T> = Omit<T, "id">;

export type EntityUpdate<T> = Partial<T>
