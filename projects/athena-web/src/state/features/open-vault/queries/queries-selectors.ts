import {Query, QueryTag} from "../open-vault-interfaces";

export interface QueryData extends Query {
  tags: QueryTag[],
}