import {Injectable, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {DatabaseTemplateDto} from "../dto/database-template.dto-interface";
import {DatabaseTagDto} from "../../tags/dto/database-tag.dto-interface";
import {TagsDatabaseService} from "../../tags/database/tags.database.service";


@Injectable()
export class TemplateTagsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing template tags query",
      originalError: e
    })
  }

  async getTags(templateId: string) {
    const sql = await this.databaseService.getSQL();

    let results: DatabaseTagDto[] = [];
    try {
      results = await sql<DatabaseTagDto[]>`SELECT tags.* FROM templates_tags JOIN tags on templates_tags.tag = tags.id WHERE templates_tags.template = ${templateId}`;
    }
    catch (e: any) {
      throw TemplateTagsDatabaseService.getDatabaseError(e);
    }

    return results.map(TagsDatabaseService.convertDatabaseDtoToDto);
  }

  async deleteTags(templateId: string) {
    const sql = await this.databaseService.getSQL();

    try {
      await sql<DatabaseTagDto[]>`DELETE FROM templates_tags WHERE templates_tags.template = ${templateId}`;
    }
    catch (e: any) {
      throw TemplateTagsDatabaseService.getDatabaseError(e);
    }
  }

  async updateTags(templateId: string, tags: string[]) {
    const sql = await this.databaseService.getSQL();

    // Clean up all old tags before adding new ones
    await this.deleteTags(templateId);

    try {
      for (const tag of tags) {
        await sql<DatabaseTemplateDto[]>`
            INSERT INTO templates_tags(id, template, tag) 
            VALUES (DEFAULT, ${templateId}, ${tag})
        `;
      }
    }
    catch (e) {
      throw TemplateTagsDatabaseService.getDatabaseError(e);
    }

    return await this.getTags(templateId);
  }
}