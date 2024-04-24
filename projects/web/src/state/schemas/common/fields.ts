import {z} from "zod";
import { JColourVariantsList } from "@ben-ryder/jigsaw-react";
import { IdField } from "@localful-athena/storage/entity-types";

export const NameField = z.string()
  .min(1, "name length must be between 1 and 50 chars")
  .max(50, "name length must be between 1 and 50 chars")
export type NameField = z.infer<typeof NameField>

export const DescriptionField = z.string()
  .min(1, "description length must be between 1 and 200 chars")
  .max(200, "description length must be between 1 and 200 chars")
  .optional()
export type DescriptionField = z.infer<typeof DescriptionField>

export const EntityReferenceListField = z.array(IdField)
export type EntityReferenceListField = z.infer<typeof EntityReferenceListField>

// These are directly mapped from Jigsaw colour variants right now.
export const ColourVariants = z.enum(JColourVariantsList);
export type ColourVariants = z.infer<typeof ColourVariants>;
