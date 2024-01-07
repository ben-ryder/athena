import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField, TagsField} from "../common/fields";
import { TagEntity } from "../tags/tags";
import { CustomFieldStorage } from "../custom-fields/custom-fields";

export const ContentItemData = z.object({
  name: NameField,
  description: z.string()
    .min(1, "description must be between 1 and 100 chars")
    .max(100, "description must be between 1 and 100 chars")
    .nullable(),
  tags: TagsField,
  fields: z.array(CustomFieldStorage)
}).strict()
export type ContentItemData = z.infer<typeof ContentItemData>

export const ContentItemEntity = Entity.merge(ContentItemData).strict()
export type ContentItemEntity = z.infer<typeof ContentItemEntity>

export interface ContentItemDto extends ContentItemEntity {
  tagEntities: TagEntity[]
}

export const ContentItemsTable = createEntityTable<ContentItemEntity>(ContentItemEntity)
export type ContentItemsTable = GenericTable<ContentItemEntity>
