import {BaseDatabaseEntity} from "../../../common/base-database-entity";
import {Tag} from "../tags/tags-interface";

export interface NoteContent {
  name: string,
  body: string,
  folderId: string | null
}

export interface DatabaseNote extends BaseDatabaseEntity, NoteContent {}

export interface Note extends DatabaseNote {
  tags: Tag[]
}

export interface NotesState {
  entities: {
    [key: string]: DatabaseNote
  },
  ids: string[]
}