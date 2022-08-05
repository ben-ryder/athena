import {z} from "zod";
import {CreateTagRequest} from "./create.tags.request";

export const UpdateTagRequest = CreateTagRequest.partial().strict();

export type UpdateTagRequest = z.infer<typeof UpdateTagRequest>;
