import {z} from "zod";

export const NotesURLParams = z.object({
    noteId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type NotesURLParams = z.infer<typeof NotesURLParams>
