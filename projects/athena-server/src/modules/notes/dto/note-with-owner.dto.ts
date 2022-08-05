import {NoteDto} from "@ben-ryder/athena-js-lib";

export interface NoteWithOwnerDto extends NoteDto {
  owner: string;
}