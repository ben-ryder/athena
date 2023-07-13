import {Entity, EntityTable} from "./entity";
import {JColourVariants} from "@ben-ryder/jigsaw-react";

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
