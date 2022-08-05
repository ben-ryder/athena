import {z} from "zod";

export const TagsURLParams = z.object({
    tagId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type TagsURLParams = z.infer<typeof TagsURLParams>
