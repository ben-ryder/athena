import {Entity, EntityTable} from "./entity";
import {JColourVariants} from "@ben-ryder/jigsaw-react/dist/00-foundations/colours/variants/colour-variants";

/**
 * Tags
 * ========================
 */
export interface TagContent {
  name: string,
  variant?: JColourVariants
}
export interface TagEntity extends Entity, TagContent {}
export type TagsTable = EntityTable<TagEntity>;
