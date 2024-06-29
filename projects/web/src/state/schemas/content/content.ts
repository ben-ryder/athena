import {z} from "zod"
import {DescriptionField, NameField, EntityReferenceListField, IsFavouriteField} from "../common/fields";
import { FieldStorage } from "../fields/fields";
import {EntityDto} from "@localful-athena/types/data-entities";
import {IdField} from "@localful-athena/types/fields";

export const ContentData = z.object({
	type: IdField,
	name: NameField,
	description: DescriptionField,
	tags: EntityReferenceListField,
	isFavourite: IsFavouriteField,
	fields: FieldStorage
}).strict()
export type ContentData = z.infer<typeof ContentData>

export type ContentDto = EntityDto<ContentData>
