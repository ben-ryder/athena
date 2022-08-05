import {TemplateDto} from "@ben-ryder/athena-js-lib";

export interface TemplateWithOwnerDto extends TemplateDto {
  owner: string;
}