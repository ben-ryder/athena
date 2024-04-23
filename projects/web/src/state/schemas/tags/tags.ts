import {z} from "zod"
import {ColourVariants, NameField} from "../common/fields";
import {EntityDto} from "@localful-athena/storage/entity-types";

export const TagData = z.object({
  name: NameField,
  colourVariant: ColourVariants.optional()
}).strict()
export type TagData = z.infer<typeof TagData>

export type TagDto = EntityDto<TagData>
