import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField, TagsField} from "../common/fields";
import { TagEntity } from "../tags/tags";

export const ItemContent = z.object({
  name: NameField,
  body: z.string(),
  tags: TagsField,
}).strict()
export type ItemContent = z.infer<typeof ItemContent>

export const ItemEntity = Entity.merge(ItemContent).strict()
export type ItemEntity = z.infer<typeof ItemEntity>

export interface ItemDto extends ItemEntity {
  tagEntities: TagEntity[]
}

export const ItemsTable = createEntityTable<ItemEntity>(ItemEntity)
export type ItemsTable = GenericTable<ItemEntity>
