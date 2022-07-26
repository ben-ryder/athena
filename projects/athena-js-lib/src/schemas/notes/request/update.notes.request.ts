import {z} from "zod";
import {CreateNoteRequestSchema} from "./create.notes.request";

export const UpdateNoteRequestSchema = CreateNoteRequestSchema.partial().strict();

export type UpdateNoteRequest = z.infer<typeof UpdateNoteRequestSchema>
