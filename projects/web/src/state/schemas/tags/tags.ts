import {z} from "zod"
import { Entity, EntityDto, EntityVersion } from "../common/entity";
import {ColourVariants, IdField, NameField} from "../common/fields";

export const TagEntity = Entity
export type TagEntity = z.infer<typeof TagEntity>

export const TagData = z.object({
  name: NameField,
  colourVariant: ColourVariants.optional()
}).strict()
export type TagData = z.infer<typeof TagData>

export const TagVersion = EntityVersion.extend({
  tagId: IdField
})
export type TagVersion = z.infer<typeof TagVersion>

export const TagDto = EntityDto.merge(TagData)
export type TagDto = z.infer<typeof TagDto>
