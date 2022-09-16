import {BaseDatabaseEntity} from "../../../common/base-database-entity";
import {NoteContent} from "../notes/notes-interface";
import {Tag} from "../tags/tags-interface";

export interface NoteTemplateContent extends NoteContent {
  targetFolderId: string | null
}

export interface DatabaseNoteTemplate extends BaseDatabaseEntity, NoteTemplateContent {}

export interface NoteTemplate extends DatabaseNoteTemplate {
  tags: Tag[]
}

export interface NoteTemplatesState {
  entities: {
    [key: string]: DatabaseNoteTemplate
  },
  ids: string[]
}
