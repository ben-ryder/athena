import {z} from "zod";

import {PaginationQueryParamsSchema} from "../../common/pagination-query-params-schema";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";

export const TagsQueryParamsSchema = PaginationQueryParamsSchema.extend({
    orderBy: z.nativeEnum(OrderByFields).optional(),
    orderDirection: z.nativeEnum(OrderDirections).optional()
})

export type TagsQueryParams = z.infer<typeof TagsQueryParamsSchema>;
