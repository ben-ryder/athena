import { Entity, EntityTable } from "../../common/entity.types";
import { OrderByFields, OrderDirection } from "../../common/lists.types";

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
