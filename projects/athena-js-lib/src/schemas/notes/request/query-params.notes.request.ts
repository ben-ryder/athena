import {z} from "zod";
import {PaginationQueryParamsSchema} from "../../common/pagination-query-params-schema";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const NotesQueryParamsSchema = PaginationQueryParamsSchema.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional(),
    tags: z.array(z.array(z.string().uuid())).optional()
})

export type NotesQueryParams = z.infer<typeof NotesQueryParamsSchema>
