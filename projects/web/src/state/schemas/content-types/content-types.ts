import {z} from "zod"
import {ColourVariants, DescriptionField, NameField} from "../common/fields";
import {EntityDto} from "@localful-headbase/types/data-entities";
import {IdField} from "@localful-headbase/types/fields";

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

export type ContentTypeDto = EntityDto<ContentTypeData>
