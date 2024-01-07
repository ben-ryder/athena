import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField} from "../common/fields";
import { JColourVariantsList } from "@ben-ryder/jigsaw-react";

// These are directly mapped from Jigsaw colour variants right now.
export const TagVariants = z.enum(JColourVariantsList);
export type TagVariants = z.infer<typeof TagVariants>;

export const TagData = z.object({
  name: NameField,
  variant: TagVariants.nullable()
}).strict()
export type TagData = z.infer<typeof TagData>

export const TagEntity = Entity.merge(TagData).strict()
export type TagEntity = z.infer<typeof TagEntity>

export interface TagDto extends TagEntity {}

export const TagsTable = createEntityTable<TagEntity>(TagEntity)
export type TagsTable = GenericTable<TagEntity>
