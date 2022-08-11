import {NoteDto} from "@ben-ryder/athena-js-lib";

export interface TestNoteDto extends NoteDto {
  owner: string;
}
