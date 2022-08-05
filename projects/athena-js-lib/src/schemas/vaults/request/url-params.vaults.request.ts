import {z} from "zod";

export const VaultsURLParams = z.object({
    vaultId: z.string().uuid()
}).strict();

export type VaultsURLParams = z.infer<typeof VaultsURLParams>
