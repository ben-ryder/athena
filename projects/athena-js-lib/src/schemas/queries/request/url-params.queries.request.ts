import {z} from "zod";

export const QueriesURLParams = z.object({
    queryId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type QueriesURLParams = z.infer<typeof QueriesURLParams>
