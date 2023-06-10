import {CustomField} from "./custom-fields";
import {Entity, EntityTable} from "./entity";

/**
 * Notes & Note Templates
 * ========================
 */
export interface NoteContent {
  name: string,
  body: string,
  tags: string[],
  customFields: CustomField[]
}
export interface NoteEntity extends Entity, NoteContent {}
export type NotesTable = EntityTable<NoteEntity>;

export interface NoteTemplateContent extends NoteContent {}
export interface NoteTemplateEntity extends Entity, NoteTemplateContent {}
export type NoteTemplatesTable = EntityTable<NoteTemplateEntity>;
