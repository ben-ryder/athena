import {z} from "zod";

export const ChangesURLParams = z.object({
    ids: z.array(z.string())
}).strict();

export type ChangesURLParams = z.infer<typeof ChangesURLParams>;
