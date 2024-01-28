import {z} from "zod"
import {ColourVariants, NameField} from "../common/fields";

export const TagData = z.object({
  name: NameField,
  colourVariant: ColourVariants.optional()
}).strict()
export type TagData = z.infer<typeof TagData>
