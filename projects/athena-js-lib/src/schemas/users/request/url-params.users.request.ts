import {z} from "zod";

export const UsersURLParams = z.object({
    userId: z.string().uuid()
}).strict();

export type UsersURLParams = z.infer<typeof UsersURLParams>;
