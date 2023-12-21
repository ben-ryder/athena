import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField} from "../common/fields";
import { JColourVariantsList } from "@ben-ryder/jigsaw-react";

// These are directly mapped from Jigsaw colour variants.
export const TagVariants = z.enum(JColourVariantsList);
export type TagVariants = z.infer<typeof TagVariants>;

export const TagContent = z.object({
  name: NameField,
  variant: TagVariants.nullable()
}).strict()
export type TagContent = z.infer<typeof TagContent>

export const TagEntity = Entity.merge(TagContent).strict()
export type TagEntity = z.infer<typeof TagEntity>

export const TagsTable = createEntityTable<TagEntity>(TagEntity)
export type TagsTable = GenericTable<TagEntity>
