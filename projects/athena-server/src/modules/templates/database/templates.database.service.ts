import {Injectable, ResourceNotFoundError, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {Row, RowList} from "postgres";


import {DatabaseListOptions} from "../../../common/database-list-options";
import {TemplateWithOwnerDto} from "../dto/template-with-owner.dto";
import {
  AthenaErrorIdentifiers, CreateTemplateRequest,
  MetaPaginationData, TemplateDto, UpdateTemplateRequest
} from "@ben-ryder/athena-js-lib";
import {DatabaseTemplateDto} from "../dto/database-template.dto-interface";
import {DatabaseTemplateWithOwnerDto} from "../dto/database-template-with-owner.dto-interface";
import {TemplateTagsDatabaseService} from "./template-tags.database.service";


@Injectable()
export class TemplatesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly templateTagsDatabaseService: TemplateTagsDatabaseService
  ) {}

  private static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case 'created_at':
        return 'createdAt';
      case 'updated_at':
        return 'updatedAt';
      default:
        return fieldName;
    }
  }

  private static convertDatabaseDtoToDto(template: DatabaseTemplateDto): TemplateDto {
    return {
      id: template.id,
      title: template.title,
      description: template.description,
      body: template.body,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      tags: []
    }
  }

  private static getDatabaseError(e: any) {
    throw new SystemError({
      message: "Unexpected error while executing templates query",
      originalError: e
    })
  }

  async get(templateId: string): Promise<TemplateDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTemplateDto[] = [];
    try {
      result = await sql<DatabaseTemplateDto[]>`SELECT * FROM templates WHERE id = ${templateId}`;
    }
    catch (e: any) {
      throw TemplatesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      const tags = await this.templateTagsDatabaseService.getTags(templateId);

      return {
        ...TemplatesDatabaseService.convertDatabaseDtoToDto(result[0]),
        tags
      };
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.NOTE_NOT_FOUND,
        applicationMessage: "The requested template could not be found."
      })
    }
  }

  async getWithOwner(templateId: string): Promise<TemplateWithOwnerDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTemplateWithOwnerDto[] = [];
    try {
      result = await sql<DatabaseTemplateWithOwnerDto[]>`SELECT templates.*, vaults.owner FROM templates INNER JOIN vaults on templates.vault = vaults.id WHERE templates.id = ${templateId}`;
    }
    catch (e: any) {
      throw TemplatesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      const tags = await this.templateTagsDatabaseService.getTags(templateId);

      return {
        ...TemplatesDatabaseService.convertDatabaseDtoToDto(result[0]),
        owner: result[0].owner,
        tags
      }
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.NOTE_NOT_FOUND,
        applicationMessage: "The requested template could not be found."
      })
    }
  }

  async create(vaultId: string, template: CreateTemplateRequest): Promise<TemplateDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTemplateDto[] = [];
    try {
      result = await sql<DatabaseTemplateDto[]>`
        INSERT INTO templates(id, title, description, body, created_at, updated_at, vault) 
        VALUES (DEFAULT, ${template.title}, ${template.description || null}, ${template.body}, DEFAULT, DEFAULT, ${vaultId})
        RETURNING *;
       `;
    }
    catch (e: any) {
      throw TemplatesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      if (Array.isArray(template.tags)) {
        await this.templateTagsDatabaseService.updateTags(result[0].id, template.tags);
      }

      const tags = await this.templateTagsDatabaseService.getTags(result[0].id);
      return {
        ...TemplatesDatabaseService.convertDatabaseDtoToDto(result[0]),
        tags
      };
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning template after creation",
      })
    }
  }

  async update(templateId: string, templateUpdate: UpdateTemplateRequest): Promise<TemplateDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(templateUpdate).length === 0) {
      return this.get(templateId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    let databaseUpdate: any = {};
    for (const fieldName of Object.keys(templateUpdate) as Array<keyof UpdateTemplateRequest>) {
      if (fieldName !== "tags") {
        databaseUpdate[TemplatesDatabaseService.mapApplicationField(fieldName)] = templateUpdate[fieldName];
      }
    }

    if (Object.keys(databaseUpdate).length > 0) {
      try {
        await sql<DatabaseTemplateDto[]>`
          UPDATE templates
          SET ${sql(databaseUpdate, ...Object.keys(databaseUpdate))}
          WHERE id = ${templateId}
      `;
      }
      catch (e: any) {
        throw TemplatesDatabaseService.getDatabaseError(e);
      }
    }

    if (Array.isArray(templateUpdate.tags)) {
      await this.templateTagsDatabaseService.updateTags(templateId, templateUpdate.tags);
    }

    return this.get(templateId);
  }

  async delete(templateId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM templates WHERE id = ${templateId}`;
    }
    catch (e: any) {
      throw TemplatesDatabaseService.getDatabaseError(e);
    }

    // If there's a count then rows were affected and the deletion was a success
    // If there's no count but an error wasn't thrown then the entity must not exist
    if (result && result.count) {
      return;
    }
    else {
      throw new ResourceNotFoundError({
        applicationMessage: "The requested template could not be found."
      })
    }
  }

  async list(vaultId: string, options: DatabaseListOptions): Promise<TemplateDto[]> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    let results: DatabaseTemplateDto[] = [];
    try {
      results = await sql<DatabaseTemplateDto[]>`SELECT * FROM templates WHERE vault = ${vaultId} ORDER BY ${sql(options.orderBy)} ${options.orderDirection === "ASC" ? sql`ASC` : sql`DESC` } LIMIT ${options.take} OFFSET ${options.skip}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching templates",
        originalError: e
      })
    }

    const templates: TemplateDto[] = [];
    for (const resultTemplate of results) {
      const tags = await this.templateTagsDatabaseService.getTags(resultTemplate.id);

      templates.push({
        ...TemplatesDatabaseService.convertDatabaseDtoToDto(resultTemplate),
        tags
      })
    }
    return templates;
  }

  async getListMetadata(vaultId: string, options: DatabaseListOptions): Promise<MetaPaginationData> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    try {
      // Offset and order don't matter for fetching the total count, so we can ignore these for the query.
      const result = await sql`SELECT count(*) FROM templates WHERE vault = ${vaultId}`;
      return {
        total: parseInt(result[0].count),
        take: options.take,
        skip: options.skip,
      };
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching template list metadata",
        originalError: e
      })
    }
  }
}