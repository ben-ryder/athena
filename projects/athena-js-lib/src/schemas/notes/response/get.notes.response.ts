import {NoteDto} from "../dtos/note.dto";
import {MetaPaginationData} from "../../common/meta-pagination-data";

export interface GetNotesResponse {
  notes: NoteDto[];
  meta: MetaPaginationData;
}
