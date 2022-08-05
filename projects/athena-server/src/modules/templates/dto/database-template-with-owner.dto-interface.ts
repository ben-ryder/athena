import {DatabaseTemplateDto} from "./database-template.dto-interface";

export interface DatabaseTemplateWithOwnerDto extends DatabaseTemplateDto {
  owner: string;
}