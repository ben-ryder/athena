import {z} from "zod";

export const UsersURLParamsSchema = z.object({
    userId: z.string().uuid()
}).strict();

export type UsersURLParams = z.infer<typeof UsersURLParamsSchema>;
