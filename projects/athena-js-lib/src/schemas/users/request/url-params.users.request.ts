import {z} from "zod";

export const UsersURLParamsSchema = z.object({
    userId: z.string().uuid()
})

export type UsersURLParams = z.infer<typeof UsersURLParamsSchema>;
