import {TagDto} from "../../tags/dtos/tag.dto";
import {OrderDirections} from "../../common/order-directions";
import {OrderByFields} from "../../common/order-by-fields";
import {QueryContentDto} from "./query-content.dto";

export interface QueryDto extends QueryContentDto {
  id: string;
  tags: TagDto[][];
  orderBy: OrderByFields;
  orderDirection: OrderDirections
  createdAt: string;
  updatedAt: string;
}
