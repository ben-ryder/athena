import {z} from "zod";
import {OrderByFields} from "../../common/order-by-fields";
import {OrderDirections} from "../../common/order-directions";

export const CreateQueryRequestSchema = z.object({
  name: z.string().min(1),
  tags: z.array(z.array(z.string().uuid())),
  orderBy: z.nativeEnum(OrderByFields),
  orderDirection: z.nativeEnum(OrderDirections)
})

export type CreateQueryRequest = z.infer<typeof CreateQueryRequestSchema>;
