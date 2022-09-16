import {BaseDatabaseEntity} from "../../../common/base-database-entity";
import {ContentType} from "../../ui/content/content-interface";
import {OrderBy} from "../../../common/order-by-enum";
import {OrderDirection} from "../../../common/order-direction-enum";

export interface QueryContent {
  name: string,
  contentTypes: ContentType[] | null
  search: string | null,
  orderBy: OrderBy,
  orderDirection: OrderDirection
}

export interface DatabaseQuery extends BaseDatabaseEntity, QueryContent {}

export interface Query extends BaseDatabaseEntity, QueryContent {}

export interface QueriesState {
  entities: {
    [key: string]: Query
  },
  ids: string[]
}