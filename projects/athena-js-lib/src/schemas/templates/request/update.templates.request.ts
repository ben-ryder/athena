import {z} from "zod";
import {CreateTemplateRequest} from "./create.templates.request";

export const UpdateTemplateRequest = CreateTemplateRequest.partial().strict();

export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateRequest>
