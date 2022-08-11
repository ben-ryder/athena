import {DatabaseTagDto} from "./database-tag.dto-interface";

export interface DatabaseTagWithOwnerDto extends DatabaseTagDto {
  owner: string;
}