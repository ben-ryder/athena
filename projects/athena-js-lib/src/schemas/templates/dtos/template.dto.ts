import {TagDto} from "../../tags/dtos/tag.dto";
import {TemplateContentDto} from "./template-content.dto";

export interface TemplateDto extends TemplateContentDto {
  id: string;
  tags: TagDto[];
  createdAt: string;
  updatedAt: string;
}
