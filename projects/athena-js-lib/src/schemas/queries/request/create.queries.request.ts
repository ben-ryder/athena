import {z} from "zod";
import {OrderByFields} from "../../common/order-by-fields";
import {OrderDirections} from "../../common/order-directions";

export const CreateQueryRequestSchema = z.object({
  name: z.string().min(1, "Your query name must be at least 1 character"),
  tags: z.array(z.array(z.string().uuid())),
  orderBy: z.nativeEnum(OrderByFields),
  orderDirection: z.nativeEnum(OrderDirections)
}).strict();

export type CreateQueryRequest = z.infer<typeof CreateQueryRequestSchema>;
