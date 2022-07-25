import {z} from "zod";

export const LoginRequestSchema = z.object({
    username: z.string(),
    password: z.string()
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
