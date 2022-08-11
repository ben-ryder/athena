import {NoteDto} from "../note.dto";


export interface NoteWithOwnerDto extends NoteDto {
  owner: string;
}
