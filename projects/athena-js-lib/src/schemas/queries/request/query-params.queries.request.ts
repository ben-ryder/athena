import {z} from "zod";
import {PaginationQueryParams} from "../../common/pagination-query-params";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const QueriesQueryParams = PaginationQueryParams.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional()
}).strict();

export type QueriesQueryParams = z.infer<typeof QueriesQueryParams>;
