import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField, TagsField} from "../common/fields";

export const ItemContent = z.object({
  name: NameField,
  body: z.string(),
  tags: TagsField,
})
export type ItemContent = z.infer<typeof ItemContent>

export const ItemEntity = Entity.merge(ItemContent)
export type ItemEntity = z.infer<typeof ItemEntity>

export const ItemsTable = createEntityTable<ItemEntity>(ItemEntity)
export type ItemsTable = GenericTable<ItemEntity>
