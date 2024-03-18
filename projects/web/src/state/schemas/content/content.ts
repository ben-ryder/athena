import {z} from "zod"
import {DescriptionField, NameField, TagsField} from "../common/fields";
import { FieldStorage } from "../fields/fields";
import {IdField} from "@localful-athena/storage/entity-types";

export const ContentData = z.object({
  type: IdField,
  name: NameField,
  description: DescriptionField,
  tags: TagsField,
  fields: FieldStorage
}).strict()
export type ContentData = z.infer<typeof ContentData>
