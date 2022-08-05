import {MetaPaginationData} from "../../common/meta-pagination-data";
import {TemplateDto} from "../dtos/template.dto";

export interface GetTemplatesResponse {
  templates: TemplateDto[];
  meta: MetaPaginationData;
}
