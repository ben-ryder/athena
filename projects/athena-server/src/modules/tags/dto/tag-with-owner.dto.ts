import {TagDto} from "@ben-ryder/athena-js-lib";

export interface TagWithOwnerDto extends TagDto {
  owner: string;
}