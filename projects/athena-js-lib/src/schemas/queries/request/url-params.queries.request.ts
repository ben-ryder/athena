import {z} from "zod";

export const QueriesURLParamsSchema = z.object({
    queryId: z.string().uuid(),
    vaultId: z.string().uuid()
})

export type QueriesURLParams = z.infer<typeof QueriesURLParamsSchema>
