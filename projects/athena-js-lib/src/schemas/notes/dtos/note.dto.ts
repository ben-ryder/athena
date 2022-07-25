import {TagDto} from "../../tags/dtos/tag.dto";
import {NoteContentDto} from "./note-content.dto";

export interface NoteDto extends NoteContentDto {
  id: string;
  tags: TagDto[];
  createdAt: string;
  updatedAt: string;
}
