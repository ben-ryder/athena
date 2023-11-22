import { Entity, EntityTable } from "../../common/entity.types";

/**
 * Pages
 */
export interface PageContent {
  name: string;
  description: string | null
  taskLists: string[];
  noteLists: string[];
}
export interface PageEntity extends Entity, PageContent {}
export type PagesTable = EntityTable<PageEntity>;
