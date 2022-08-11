import {NoteDto, TemplateDto} from "@ben-ryder/athena-js-lib";


export interface NoteContent {
  type: "note",
  content: NoteDto
}
export interface TemplateContent {
  type: "template",
  content: TemplateDto
}

export type OpenContent = NoteContent|TemplateContent[];

export type ActiveContent = NoteContent|TemplateContent;
