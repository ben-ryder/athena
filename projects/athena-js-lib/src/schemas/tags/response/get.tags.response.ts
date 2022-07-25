import {TagDto} from "../dtos/tag.dto";
import {MetaPaginationData} from "../../common/meta-pagination-data";

export interface GetTagsResponse {
  tags: TagDto[];
  meta: MetaPaginationData
}
