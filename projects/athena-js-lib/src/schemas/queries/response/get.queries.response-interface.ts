import {QueryDto} from "../dtos/query.dto";
import {MetaPaginationData} from "../../common/meta-pagination-data";

export interface GetQueriesResponse {
  queries: QueryDto[];
  meta: MetaPaginationData;
}
