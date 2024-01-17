import {z} from "zod"
import {Entity, EntityDto, EntityVersion} from "../common/entity";
import {DescriptionField, IdField, NameField, TagsField} from "../common/fields";
import { FieldStorage } from "../fields/fields";

export const ContentData = z.object({
  name: NameField,
  description: DescriptionField,
  tags: TagsField,
  fields: z.array(FieldStorage)
}).strict()
export type ContentData = z.infer<typeof ContentData>

export const ContentEntity = Entity.extend({
  contentTypeId: IdField
})
export type ContentEntity = z.infer<typeof ContentEntity>

export const ContentVersion = EntityVersion.extend({
  contentId: IdField
})
export type ContentVersion = z.infer<typeof ContentVersion>

export const ContentDto = EntityDto.merge(ContentData)
export type ContentDto = z.infer<typeof ContentDto>
