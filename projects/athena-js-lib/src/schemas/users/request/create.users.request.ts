import {z} from "zod";


export const CreateUserRequestSchema = z.object({
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  encryptionSecret: z.string()
});

export type CreateUsersRequest = z.infer<typeof CreateUserRequestSchema>;
