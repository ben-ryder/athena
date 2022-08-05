import {z} from "zod";
import {PaginationQueryParams} from "../../common/pagination-query-params";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const NotesQueryParams = PaginationQueryParams.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional(),
    tags: z.array(z.array(z.string().uuid())).optional()
}).strict();

export type NotesQueryParams = z.infer<typeof NotesQueryParams>
