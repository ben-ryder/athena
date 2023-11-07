import { Entity, EntityTable } from "../../common/entity.types.js";

/**
 * Pages
 */
export interface PageContent {
  name: string;
  taskLists: string[];
  noteLists: string[];
}
export interface PageEntity extends Entity, PageContent {}
export type PagesTable = EntityTable<PageEntity>;
