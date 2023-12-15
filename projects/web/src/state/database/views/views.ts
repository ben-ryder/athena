import {createEntityTable, Entity, GenericTable} from "../common/entity";
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

export const ViewEntity = Entity.merge(ViewContent).strict()
export type ViewEntity = z.infer<typeof ViewEntity>

export const ViewsTable = createEntityTable<ViewEntity>(ViewEntity)
export type ViewsTable = GenericTable<ViewEntity>
