import {z} from "zod"
import { Entity, EntityDto, EntityVersion } from "../common/entity";
import { IdField, NameField } from "../common/fields";
import { JColourVariantsList } from "@ben-ryder/jigsaw-react";

export const TagEntity = Entity
export type TagEntity = z.infer<typeof TagEntity>

// These are directly mapped from Jigsaw colour variants right now.
export const TagVariants = z.enum(JColourVariantsList);
export type TagVariants = z.infer<typeof TagVariants>;

export const TagData = z.object({
  name: NameField,
  variant: TagVariants.nullable()
}).strict()
export type TagData = z.infer<typeof TagData>

export const TagVersion = EntityVersion.extend({
  tagId: IdField
})
export type TagVersion = z.infer<typeof TagVersion>

export const TagDto = EntityDto.merge(TagData)
export type TagDto = z.infer<typeof TagDto>
