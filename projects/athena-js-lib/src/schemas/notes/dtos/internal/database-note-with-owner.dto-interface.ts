import {DatabaseNoteDto} from "./database-note.dto-interface";

export interface DatabaseNoteWithOwnerDto extends DatabaseNoteDto {
  owner: string;
}