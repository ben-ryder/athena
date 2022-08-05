import {z} from "zod";

export const NotesURLParamsSchema = z.object({
    noteId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type NotesURLParams = z.infer<typeof NotesURLParamsSchema>
