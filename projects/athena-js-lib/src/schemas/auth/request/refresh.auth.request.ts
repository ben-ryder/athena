import {z} from "zod";
import isJWT from "validator/lib/isJWT";

export const RefreshRequestSchema = z.object({
    refreshToken: z.string().refine(isJWT, {message: "Refresh token must be a JWT"})
})

export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
