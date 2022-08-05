import {z} from "zod";
import {CreateNoteRequest} from "./create.notes.request";

export const UpdateNoteRequest = CreateNoteRequest.partial().strict();

export type UpdateNoteRequest = z.infer<typeof UpdateNoteRequest>
