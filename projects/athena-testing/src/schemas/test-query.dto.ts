import {QueryDto} from "@ben-ryder/athena-js-lib";

export interface TestQueryDto extends QueryDto {
  owner: string;
}
