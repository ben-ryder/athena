import {z} from "zod";
import {CreateUserRequestSchema} from "./create.users.request";

export const UpdateUserRequestSchema = CreateUserRequestSchema.partial().strict();;

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
