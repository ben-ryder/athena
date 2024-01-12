import {z} from "zod";
import { JColourVariantsList } from "@ben-ryder/jigsaw-react";

export const IdField = z.string().uuid()
export type IdField = z.infer<typeof IdField>

export const NameField = z.string()
  .min(1, "name length must be between 1 and 50 chars")
  .max(50, "name length must be between 1 and 50 chars")
export type NameField = z.infer<typeof NameField>

export const DescriptionField = z.string()
  .min(1, "description length must be between 1 and 200 chars")
  .max(200, "description length must be between 1 and 200 chars")
  .optional()
export type DescriptionField = z.infer<typeof DescriptionField>

export const TagsField = z.array(IdField)
export type TagsField = z.infer<typeof TagsField>

export const CreatedAtField = z.string().datetime()
export type CreatedAtField = z.infer<typeof CreatedAtField>

export const UpdatedAtField =  z.string().datetime()
export type UpdatedAtField = z.infer<typeof CreatedAtField>

// These are directly mapped from Jigsaw colour variants right now.
export const ColourVariants = z.enum(JColourVariantsList);
export type ColourVariants = z.infer<typeof ColourVariants>;
