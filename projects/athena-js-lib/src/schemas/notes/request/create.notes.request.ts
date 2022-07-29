import {z} from "zod";

export const CreateNoteRequestSchema = z.object({
  title: z.string()
    .min(1, "Your note title must be at least 1 character")
    .max(255, "Your note description can't be more than 255 characters"),
  body: z.string(),
  tags: z.array(z.string().uuid()).optional()
}).strict();

export type CreateNoteRequest = z.infer<typeof CreateNoteRequestSchema>
