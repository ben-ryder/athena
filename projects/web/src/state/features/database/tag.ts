import {Entity, EntityTable} from "./entity";

/**
 * Tags
 * ========================
 */
export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}
export interface TagEntity extends Entity, TagContent {}
export type TagsTable = EntityTable<TagEntity>;
