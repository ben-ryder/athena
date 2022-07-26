import {z} from "zod";

export const CreateVaultRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional()
}).strict();

export type CreateVaultRequest = z.infer<typeof CreateVaultRequestSchema>;

