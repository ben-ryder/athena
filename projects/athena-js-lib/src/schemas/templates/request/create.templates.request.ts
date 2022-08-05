import {z} from "zod";

export const CreateTemplateRequest = z.object({
  title: z.string()
    .min(1, "Your template title must be at least 1 character")
    .max(100, "Your template title can't be more than 255 characters"),
  description: z.string()
    .max(255, "Your template description can't be over 255 characters")
    .nullable()
    .optional(),
  body: z.string(),
  tags: z.array(z.string().uuid()).optional(),
}).strict();

export type CreateTemplateRequest = z.infer<typeof CreateTemplateRequest>
