import {z} from "zod";

export const VaultsURLParamsSchema = z.object({
    vaultId: z.string().uuid()
}).strict();

export type VaultsURLParams = z.infer<typeof VaultsURLParamsSchema>
