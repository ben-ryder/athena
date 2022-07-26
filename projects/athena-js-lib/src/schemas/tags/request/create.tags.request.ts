import {z} from "zod";
import isHexColor from "validator/lib/isHexColor";

export const CreateTagRequestSchema = z.object({
  name: z.string().min(1),
  backgroundColour: z.string().refine(isHexColor).optional(),
  textColour: z.string().refine(isHexColor).optional()
}).strict();

export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>

