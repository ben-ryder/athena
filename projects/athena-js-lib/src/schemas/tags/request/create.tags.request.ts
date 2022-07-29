import {z} from "zod";
import isHexColor from "validator/lib/isHexColor";

export const CreateTagRequestSchema = z.object({
  name: z.string()
    .min(1, "Your tag name must be at least 1 character"),
  backgroundColour: z.string()
    .refine(isHexColor, "Background colour must be a hex code")
    .optional(),
  textColour: z.string()
    .refine(isHexColor, "Text colour must be a hex code")
    .optional()
}).strict();

export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>

