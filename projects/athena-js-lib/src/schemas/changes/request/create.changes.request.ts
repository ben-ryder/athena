import {z} from "zod";


export const CreateChangesRequest = z.array(
  z.object({
    id: z.string(),
    data: z.string()
  }).strict()
);

export type CreateChangesRequest = z.infer<typeof CreateChangesRequest>;
