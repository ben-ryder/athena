import {Injectable, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {DatabaseNoteDto} from "../dto/internal-note.dto-interface";
import {DatabaseTagDto} from "../../tags/dto/internal-tag.dto-interface";
import {TagsDatabaseService} from "../../tags/database/tags.database.service";


@Injectable()
export class NoteTagsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing note tags query",
      originalError: e
    })
  }

  async getTags(noteId: string) {
    const sql = await this.databaseService.getSQL();

    let results: DatabaseTagDto[] = [];
    try {
      results = await sql<DatabaseTagDto[]>`SELECT tags.* FROM notes_tags JOIN tags on notes_tags.tag = tags.id WHERE notes_tags.note = ${noteId}`;
    }
    catch (e: any) {
      throw NoteTagsDatabaseService.getDatabaseError(e);
    }

    return results.map(TagsDatabaseService.convertDatabaseDtoToDto);
  }

  async deleteTags(noteId: string) {
    const sql = await this.databaseService.getSQL();

    try {
      await sql<DatabaseTagDto[]>`DELETE FROM notes_tags WHERE notes_tags.note = ${noteId}`;
    }
    catch (e: any) {
      throw NoteTagsDatabaseService.getDatabaseError(e);
    }
  }

  async updateTags(noteId: string, tags: string[]) {
    const sql = await this.databaseService.getSQL();

    // Clean up all old tags before adding new ones
    await this.deleteTags(noteId);

    try {
      for (const tag of tags) {
        await sql<DatabaseNoteDto[]>`
            INSERT INTO notes_tags(id, note, tag) 
            VALUES (DEFAULT, ${noteId}, ${tag})
        `;
      }
    }
    catch (e) {
      throw NoteTagsDatabaseService.getDatabaseError(e);
    }

    return await this.getTags(noteId);
  }
}