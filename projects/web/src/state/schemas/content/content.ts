import {z} from "zod"
import {DescriptionField, NameField, TagsField} from "../common/fields";
import { FieldStorage } from "../fields/fields";

export const ContentData = z.object({
  name: NameField,
  description: DescriptionField,
  tags: TagsField,
  fields: FieldStorage
}).strict()
export type ContentData = z.infer<typeof ContentData>
