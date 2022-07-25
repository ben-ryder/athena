import {CreateVaultRequestSchema} from "./create.vaults.request";
import {z} from "zod";

export const UpdateVaultRequestSchema = CreateVaultRequestSchema.partial()

export type UpdateVaultRequest = z.infer<typeof UpdateVaultRequestSchema>;
