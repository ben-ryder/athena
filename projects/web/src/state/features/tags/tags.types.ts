import { Entity, EntityTable } from "../../common/entity.types";
import { JColourVariants } from "@ben-ryder/jigsaw-react";

/**
 * Tags
 * ========================
 */
export interface TagContent {
  name: string;
  variant: JColourVariants | null;
}
export interface TagEntity extends Entity, TagContent {}
export type TagsTable = EntityTable<TagEntity>;
