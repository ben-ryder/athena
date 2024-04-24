import {z} from "zod";
import {DescriptionField, NameField, EntityReferenceListField} from "../common/fields";
import {EntityDto} from "@localful-athena/storage/entity-types";

export const ORDER_BY_FIELDS = ["createdAt", "updatedAt", "name"] as const
export const OrderByFields = z.enum(ORDER_BY_FIELDS);

export const ORDER_DIRECTION = ["asc", "desc"] as const
export const OrderDirection = z.enum(ORDER_DIRECTION);

export const ViewData = z.object({
  // View Fields
  name: NameField,
  description: DescriptionField,
  tags: EntityReferenceListField,
  // Query Fields
  queryContentTypes: z.array(z.string().uuid()),
  queryTags: EntityReferenceListField,
  queryOrderBy: OrderByFields,
  queryOrderDirection: OrderDirection
}).strict()
export type ViewData = z.infer<typeof ViewData>

export type ViewDto = EntityDto<ViewData>
