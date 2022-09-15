import {BaseDatabaseEntity} from "../../../common/base-database-entity";
import {NoteContent} from "../notes/notes-interface";
import {Tag} from "../tags/tags-interface";

export interface TemplateContent extends NoteContent {
  targetFolderId: string | null
}

export interface DatabaseTemplate extends BaseDatabaseEntity, TemplateContent {}

export interface Template extends DatabaseTemplate {
  tags: Tag[]
}

export interface TemplatesState {
  entities: {
    [key: string]: DatabaseTemplate
  },
  ids: string[]
}