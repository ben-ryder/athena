import {CreateVaultRequestSchema} from "./create.vaults.request";
import {z} from "zod";

export const UpdateVaultRequestSchema = CreateVaultRequestSchema.partial().strict();

export type UpdateVaultRequest = z.infer<typeof UpdateVaultRequestSchema>;

export const UpdateVaultRequestKeys = UpdateVaultRequestSchema.keyof();
