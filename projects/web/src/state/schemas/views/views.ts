import {z} from "zod";
import {NameField, TagsField} from "../common/fields";

export const ORDER_BY_FIELDS = ["createdAt", "updatedAt", "name"] as const
export const OrderByFields = z.enum(ORDER_BY_FIELDS);

export const ORDER_DIRECTION = ["asc", "desc"] as const
export const OrderDirection = z.enum(ORDER_DIRECTION);

export const ViewContent = z.object({
  name: NameField,
  tags: TagsField,
  orderBy: OrderByFields,
  orderDirection: OrderDirection
}).strict()
