import {z} from "zod"
import {NameField, EntityReferenceListField, IsFavouriteField} from "../common/fields";
import { FieldStorage } from "../fields/fields";
import {EntityDto} from "@localful-headbase/types/data-entities";
import {IdField} from "@localful-headbase/types/fields";

export const ContentData = z.object({
	type: IdField,
	name: NameField,
	tags: EntityReferenceListField,
	isFavourite: IsFavouriteField,
	fields: FieldStorage
}).strict()
export type ContentData = z.infer<typeof ContentData>

export type ContentDto = EntityDto<ContentData>
