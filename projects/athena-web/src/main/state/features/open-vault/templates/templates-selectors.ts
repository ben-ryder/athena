import {Tag, Template} from "../open-vault-interfaces";

export interface TemplateData extends Template {
  tags: Tag[]
}