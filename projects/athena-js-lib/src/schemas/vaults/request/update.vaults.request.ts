import {CreateVaultRequest} from "./create.vaults.request";
import {z} from "zod";

export const UpdateVaultRequest = CreateVaultRequest.partial().strict();

export type UpdateVaultRequest = z.infer<typeof UpdateVaultRequest>;

export const UpdateVaultRequestKeys = UpdateVaultRequest.keyof();
