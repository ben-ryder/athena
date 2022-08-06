import {z} from "zod";
import {CreateUserRequest} from "./create.users.request";

export const UpdateUserRequest = CreateUserRequest.partial().strict();

export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;
