import {z} from "zod";
import {PaginationQueryParams} from "../../common/pagination-query-params";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const TemplatesQueryParams = PaginationQueryParams.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional(),
    tags: z.array(z.array(z.string().uuid())).optional()
}).strict();

export type TemplatesQueryParams = z.infer<typeof TemplatesQueryParams>;
