import {z} from "zod";

import {PaginationQueryParams} from "../../common/pagination-query-params";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const VaultsQueryParams = PaginationQueryParams.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional()
}).strict();

export type VaultsQueryParams = z.infer<typeof VaultsQueryParams>;
