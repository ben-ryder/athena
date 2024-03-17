import { ColourVariantField } from "./common";
import { BaseDto, BaseLocalEntity, BaseVersion } from "../entity-types";

export interface TagData {
	name: string,
	colourVariant: ColourVariantField
}

export interface TagEntity extends BaseLocalEntity {}
export interface TagVersion extends BaseVersion, TagData {}
export interface TagDto extends BaseDto, TagData {}

