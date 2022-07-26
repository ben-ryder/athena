import {z} from "zod";
import {CreateTagRequestSchema} from "./create.tags.request";

export const UpdateTagRequestSchema = CreateTagRequestSchema.partial().strict();

export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;
