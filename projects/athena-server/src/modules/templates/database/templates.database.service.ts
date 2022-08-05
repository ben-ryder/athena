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
import {DatabaseNoteWithOwnerDto} from "../../notes/dto/database-note-with-owner.dto-interface";


@Injectable()
export class TemplatesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
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

  private static mapDatabaseEntity(template: DatabaseTemplateDto): TemplateDto {
    return {
      id: template.id,
      title: template.title,
      body: template.body,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      tags: [] // todo: how?
    }
  }

  private static handleDatabaseError(e: any) {
    throw new SystemError({
      message: "Unexpected error while creating template",
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
      throw new SystemError({
        message: "Unexpected error while fetching template",
        originalError: e
      })
    }

    if (result.length > 0) {
      return TemplatesDatabaseService.mapDatabaseEntity(result[0]);
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

    let result: DatabaseNoteWithOwnerDto[] = [];
    try {
      result = await sql<DatabaseNoteWithOwnerDto[]>`SELECT templates.*, vaults.owner FROM templates INNER JOIN vaults on templates.vault = vaults.id WHERE templates.id = ${templateId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching template",
        originalError: e
      })
    }

    if (result.length > 0) {
      return {
        ...TemplatesDatabaseService.mapDatabaseEntity(result[0]),
        owner: result[0].owner
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
      TemplatesDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return TemplatesDatabaseService.mapDatabaseEntity(result[0]);
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
    let updateObject: any = {};
    for (const fieldName of Object.keys(templateUpdate) as Array<keyof UpdateTemplateRequest>) {
      updateObject[TemplatesDatabaseService.mapApplicationField(fieldName)] = templateUpdate[fieldName];
    }

    let result: DatabaseTemplateDto[] = [];
    try {
      result = await sql<DatabaseTemplateDto[]>`
        UPDATE templates
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE id = ${templateId}
        RETURNING *;
      `;
    }
    catch (e: any) {
      TemplatesDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return TemplatesDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning template after creation",
      })
    }
  }

  async delete(templateId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM templates WHERE id = ${templateId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while deleting template",
        originalError: e
      })
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
    let result: DatabaseTemplateDto[] = [];
    try {
      result = await sql<DatabaseTemplateDto[]>`SELECT * FROM templates WHERE vault = ${vaultId} ORDER BY ${sql(options.orderBy)} ${options.orderDirection === "ASC" ? sql`ASC` : sql`DESC` } LIMIT ${options.take} OFFSET ${options.skip}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching templates",
        originalError: e
      })
    }

    return result.map(TemplatesDatabaseService.mapDatabaseEntity);
  }

  async getListMetadata(vaultId: string, options: DatabaseListOptions): Promise<MetaPaginationData> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    try {
      // Offset and order don't matter for fetching the total count, so we can ignore these for the query.
      const result = await sql`SELECT count(*) FROM templates WHERE id = ${vaultId}`;
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