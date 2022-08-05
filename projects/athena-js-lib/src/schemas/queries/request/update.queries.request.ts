import {z} from "zod";
import {CreateQueryRequest} from "./create.queries.request";

export const UpdateQueryRequest = CreateQueryRequest.partial().strict();

export type UpdateQueryRequest = z.infer<typeof UpdateQueryRequest>;
