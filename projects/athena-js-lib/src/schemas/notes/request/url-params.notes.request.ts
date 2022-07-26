import {z} from "zod";

export const NoteURLParamsSchema = z.object({
    noteId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type NoteURLParams = z.infer<typeof NoteURLParamsSchema>