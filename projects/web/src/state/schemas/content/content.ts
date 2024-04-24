import {z} from "zod"
import {DescriptionField, NameField, EntityReferenceListField} from "../common/fields";
import { FieldStorage } from "../fields/fields";
import {EntityDto, IdField} from "@localful-athena/storage/entity-types";

export const ContentData = z.object({
  type: IdField,
  name: NameField,
  description: DescriptionField,
  tags: EntityReferenceListField,
  fields: FieldStorage
}).strict()
export type ContentData = z.infer<typeof ContentData>

export type ContentDto = EntityDto<ContentData>
