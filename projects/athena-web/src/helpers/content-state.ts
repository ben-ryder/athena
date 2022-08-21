import {NoteDto, TagDto, TemplateDto} from "@ben-ryder/athena-js-lib";

export enum ContentType {
  NOTE_NEW,
  NOTE_EDIT,
  TEMPLATE_NEW,
  TEMPLATE_EDIT
}

export interface NewContent {
  title: string,
  description: string | null,
  body: string,
  tags: TagDto[]
}

export interface NewNoteContent {
  type: ContentType.NOTE_NEW,
  content: NewContent
}
export interface NewTemplateContent {
  type: ContentType.TEMPLATE_NEW,
  content: NewContent
}
export interface EditNoteContent {
  type: ContentType.NOTE_EDIT,
  content: NoteDto
}
export interface EditTemplateContent {
  type: ContentType.TEMPLATE_EDIT,
  content: TemplateDto
}

export type ContentList = Content[];

export type Content = NewNoteContent|NewTemplateContent|EditNoteContent|EditTemplateContent;
