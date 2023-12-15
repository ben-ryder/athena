import {z} from "zod"
import {Entity, createEntityTable, GenericTable} from "../common/entity";
import {NameField} from "../common/fields";
import {JColourVariants} from "@ben-ryder/jigsaw-react";

// These are directly mapped from Jigsaw colour variants.
export const TAG_VARIANTS = [
  JColourVariants.teal,
  JColourVariants.blueGrey,
  JColourVariants.white,
  JColourVariants.red,
  JColourVariants.orange,
  JColourVariants.yellow,
  JColourVariants.green,
  JColourVariants.blue,
  JColourVariants.purple,
  JColourVariants.pink,
] as const;
export const TagVariants = z.enum(TAG_VARIANTS);
export type TagVariants = z.infer<typeof TagVariants>;

export const TagContent = z.object({
  name: NameField,
  variant: TagVariants.nullable()
})
export type TagContent = z.infer<typeof TagContent>

export const TagEntity = Entity.merge(TagContent)
export type TagEntity = z.infer<typeof TagEntity>

export const TagsTable = createEntityTable<TagEntity>(TagEntity)
export type TagsTable = GenericTable<TagEntity>
