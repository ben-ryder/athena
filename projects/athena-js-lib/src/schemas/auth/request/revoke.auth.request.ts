import {z} from "zod";
import isJWT from "validator/lib/isJWT";

export const RevokeRequest = z.object({
    refreshToken: z.string().refine(isJWT, {message: "Refresh token must be a JWT"}).optional(),
    accessToken: z.string().refine(isJWT, {message: "Access token must be a JWT"}).optional()
}).strict();

export type RevokeRequest = z.infer<typeof RevokeRequest>;

