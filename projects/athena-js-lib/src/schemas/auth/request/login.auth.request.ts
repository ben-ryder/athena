import {z} from "zod";

export const LoginRequest = z.object({
    username: z.string().min(1, "Your username should not be empty"),
    password: z.string().min(1, "Your password should not be empty")
}).strict();

export type LoginRequest = z.infer<typeof LoginRequest>;
