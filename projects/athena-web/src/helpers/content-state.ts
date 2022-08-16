import {NoteDto, TagDto, TemplateDto} from "@ben-ryder/athena-js-lib";

export interface NewContent {
  title: string,
  description: string | null,
  body: string,
  tags: TagDto[]
}

export interface NewNoteContent {
  type: "note-new",
  content: NewContent
}
export interface NewTemplateContent {
  type: "template-new",
  content: NewContent
}
export interface EditNoteContent {
  type: "note-edit",
  content: NoteDto
}
export interface EditTemplateContent {
  type: "template-edit",
  content: TemplateDto
}

export type ContentList = Content[];

export type Content = NewNoteContent|NewTemplateContent|EditNoteContent|EditTemplateContent;
