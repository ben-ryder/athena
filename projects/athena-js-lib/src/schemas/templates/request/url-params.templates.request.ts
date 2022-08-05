import {z} from "zod";

export const TemplatesURLParams = z.object({
    templateId: z.string().uuid(),
    vaultId: z.string().uuid()
}).strict();

export type TemplatesURLParams = z.infer<typeof TemplatesURLParams>
