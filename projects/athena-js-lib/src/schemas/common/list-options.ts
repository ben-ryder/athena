import {OrderByFields} from "./order-by-fields";
import {OrderDirections} from "./order-directions";


export interface ListOptions {
  take: number,
  skip: number,
  orderBy: OrderByFields,
  orderDirection: OrderDirections
}
