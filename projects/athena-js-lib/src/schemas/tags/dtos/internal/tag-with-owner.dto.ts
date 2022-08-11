import {TagDto} from "../tag.dto";


export interface TagWithOwnerDto extends TagDto {
  owner: string;
}
