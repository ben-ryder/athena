import {z} from "zod";

export const CreateNoteRequest = z.object({
  title: z.string()
    .min(1, "Your note title must be at least 1 character")
    .max(100, "Your note title can't be more than 255 characters"),
  description: z.string()
    .max(255, "Your note description can't be over 255 characters")
    .nullable()
    .optional(),
  body: z.string(),
  tags: z.array(z.string().uuid()).optional(),
  folder: z.string().uuid("A note folder must reference a folder ID")
}).strict();

export type CreateNoteRequest = z.infer<typeof CreateNoteRequest>
