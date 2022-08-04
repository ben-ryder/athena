import {OrderByFields} from "./schemas/common/order-by-fields";
import {OrderDirections} from "./schemas/common/order-directions";

export const DefaultListOptions = {
  take: 24,
  skip: 0,
  orderBy: OrderByFields.UPDATED_AT,
  orderDirection: OrderDirections.DESC
}

export const DefaultVaultsListOptions = DefaultListOptions;
export const DefaultNotesListOptions = DefaultListOptions;
export const DefaultTagsListOptions = DefaultListOptions;
export const DefaultQueriesListOptions = DefaultListOptions;
