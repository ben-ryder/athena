import {z} from "zod";


export const CreateUserRequest = z.object({
  username: z.string()
    .min(1, "Your username must be at least 1 character")
    .max(20, "Your username can't be more than 20 characters"),
  email: z.string()
    .email("Email address is not valid"),
  password: z.string()
    .min(8, "Your password must be at least 8 characters"),
  encryptionSecret: z.string()
}).strict();

export type CreateUserRequest = z.infer<typeof CreateUserRequest>;
