import {z} from "zod";

export const CreateNoteRequestSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string(),
  tags: z.array(z.string().uuid()).optional()
}).strict();

export type CreateNoteRequest = z.infer<typeof CreateNoteRequestSchema>
