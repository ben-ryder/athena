import { Entity, EntityTable } from "./entity";
import { OrderByFields, OrderDirection } from "../../common/lists";

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
