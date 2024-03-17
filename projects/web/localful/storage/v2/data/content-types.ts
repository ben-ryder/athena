import { ColourVariantField, TagsField } from "./common";

export interface ContentTypeData {
  name: string,
  description?: string,
  icon?: string,
  colourVariant?: ColourVariantField,
  contentTemplateName?: string,
  contentTemplateDescription?: string,
  contentTemplateTags?: TagsField,
  fields: string[]
}
