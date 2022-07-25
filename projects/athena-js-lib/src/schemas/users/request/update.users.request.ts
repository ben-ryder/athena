import {z} from "zod";
import {CreateUserRequestSchema} from "./create.users.request";

export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();

export type UpdateUsersRequest = z.infer<typeof UpdateUserRequestSchema>;
