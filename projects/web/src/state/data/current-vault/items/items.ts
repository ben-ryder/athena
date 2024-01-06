import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField, TagsField} from "../common/fields";
import { TagEntity } from "../tags/tags";
import {CustomFieldStorage} from "../custom-fields/custom-fields";

export const ItemContent = z.object({
  name: NameField,
  description: z.string()
    .min(1, "description must be between 1 and 100 chars")
    .max(100, "description must be between 1 and 100 chars")
    .nullable(),
  tags: TagsField,
  customFields: z.array(CustomFieldStorage)
}).strict()
export type ItemContent = z.infer<typeof ItemContent>

export const ItemEntity = Entity.merge(ItemContent).strict()
export type ItemEntity = z.infer<typeof ItemEntity>

export interface ItemDto extends ItemEntity {
  tagEntities: TagEntity[]
}

export const ItemsTable = createEntityTable<ItemEntity>(ItemEntity)
export type ItemsTable = GenericTable<ItemEntity>
