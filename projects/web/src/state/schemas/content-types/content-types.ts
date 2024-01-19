import {z} from "zod"
import {Entity, EntityDto, EntityVersion} from "../common/entity";
import {ColourVariants, DescriptionField, IdField, NameField} from "../common/fields";

export const ContentTypeData = z.object({
  name: NameField,
  description: DescriptionField,
  icon: z.string().optional(),
  colourVariant: ColourVariants.optional(),
  contentTemplateName: NameField.optional(),
  contentTemplateDescription: NameField.optional(),
  contentTemplateTags: z.array(IdField).optional(),
  fields: z.array(IdField)
}).strict()
export type ContentTypeData = z.infer<typeof ContentTypeData>

export const ContentTypeEntity = Entity
export type ContentTypeEntity = z.infer<typeof ContentTypeEntity>

export const ContentTypeVersion = EntityVersion.extend({
  contentTypeId: IdField
})
export type ContentTypeVersion = z.infer<typeof ContentTypeVersion>

export const ContentTypeDto = EntityDto.merge(ContentTypeData)
export type ContentTypeDto = z.infer<typeof ContentTypeDto>
