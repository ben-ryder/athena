import {TemplateDto} from "../template.dto";


export interface TemplateWithOwnerDto extends TemplateDto {
  owner: string;
}
