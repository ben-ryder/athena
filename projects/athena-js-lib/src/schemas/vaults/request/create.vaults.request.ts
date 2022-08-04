import {z} from "zod";

export const CreateVaultRequestSchema = z.object({
  name: z.string()
    .min(1, "Your vault name must be at least 1 character")
    .max(100, "Your vault name can't be longer than 100 characters"),
  description: z.string()
    .max(255, "Your vault description can't be over 255 characters")
    .nullable()
    .optional()
}).strict();

export type CreateVaultRequest = z.infer<typeof CreateVaultRequestSchema>;

