import { Entity, EntityTable } from "../common/entity.types";

/**
 * Items
 */
export interface ItemContent {
  name: string;
  body: string;
  tags: string[];
}
export interface ItemEntity extends Entity, ItemContent {}
export type ItemsTable = EntityTable<ItemEntity>;
