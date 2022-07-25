import {z} from "zod";

export const TagsURLParamsSchema = z.object({
    tagId: z.string().uuid(),
    vaultId: z.string().uuid()
})

export type TagsURLParams = z.infer<typeof TagsURLParamsSchema>
