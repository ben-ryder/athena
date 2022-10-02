import {z} from "zod";

export const ChangeRequest = z.object({
  id: z.string(),
  data: z.string()
}).strict();
export type ChangeRequest = z.infer<typeof ChangeRequest>;

export const CreateChangesRequest = z.array(ChangeRequest);
export type CreateChangesRequest = z.infer<typeof CreateChangesRequest>;
