import {Injectable, ResourceNotFoundError, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {Row, RowList} from "postgres";

import {DatabaseListOptions} from "../../../common/database-list-options";
import {TagWithOwnerDto} from "../dto/tag-with-owner.dto";
import {
  AthenaErrorIdentifiers,
  CreateTagRequest,
  MetaPaginationData,
  TagDto,
  UpdateTagRequest
} from "@ben-ryder/athena-js-lib";
import {DatabaseTagDto} from "../dto/database-tag.dto-interface";
import {DatabaseTagWithOwnerDto} from "../dto/database-tag-with-owner.dto-interface";


@Injectable()
export class TagsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case 'created_at':
        return 'createdAt';
      case 'updated_at':
        return 'updatedAt';
      default:
        return fieldName;
    }
  }

  static mapDatabaseEntity(tag: DatabaseTagDto): TagDto {
    return {
      id: tag.id,
      name: tag.name,
      backgroundColour: tag.background_colour || null,
      textColour: tag.text_colour,
      createdAt: tag.created_at,
      updatedAt: tag.updated_at,
      // tags: [] // todo: how?
    }
  }

  private static handleDatabaseError(e: any) {
    throw new SystemError({
      message: "Unexpected error while creating tag",
      originalError: e
    })
  }

  async get(tagId: string): Promise<TagDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTagDto[] = [];
    try {
      result = await sql<DatabaseTagDto[]>`SELECT * FROM tags WHERE id = ${tagId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching tag",
        originalError: e
      })
    }

    if (result.length > 0) {
      return TagsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.NOTE_NOT_FOUND,
        applicationMessage: "The requested tag could not be found."
      })
    }
  }

  async getWithOwner(tagId: string): Promise<TagWithOwnerDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTagWithOwnerDto[] = [];
    try {
      result = await sql<DatabaseTagWithOwnerDto[]>`SELECT tags.*, vaults.owner FROM tags INNER JOIN vaults on tags.vault = vaults.id WHERE tags.id = ${tagId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching tag",
        originalError: e
      })
    }

    if (result.length > 0) {
      return {
        ...TagsDatabaseService.mapDatabaseEntity(result[0]),
        owner: result[0].owner
      }
    }
    else {
      throw new ResourceNotFoundError({
        identifier: AthenaErrorIdentifiers.TAG_NOT_FOUND,
        applicationMessage: "The requested tag could not be found."
      })
    }
  }

  async create(vaultId: string, tag: CreateTagRequest): Promise<TagDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseTagDto[] = [];
    try {
      result = await sql<DatabaseTagDto[]>`
        INSERT INTO tags(id, name, background_colour, text_colour, created_at, updated_at, vault) 
        VALUES (DEFAULT, ${tag.name}, ${tag.backgroundColour || null}, ${tag.textColour || null}, DEFAULT, DEFAULT, ${vaultId})
        RETURNING *;
       `;
    }
    catch (e: any) {
      TagsDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return TagsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning tag after creation",
      })
    }
  }

  async update(tagId: string, tagUpdate: UpdateTagRequest): Promise<TagDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(tagUpdate).length === 0) {
      return this.get(tagId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    let updateObject: any = {};
    for (const fieldName of Object.keys(tagUpdate) as Array<keyof UpdateTagRequest>) {
      updateObject[TagsDatabaseService.mapApplicationField(fieldName)] = tagUpdate[fieldName];
    }

    let result: DatabaseTagDto[] = [];
    try {
      result = await sql<DatabaseTagDto[]>`
        UPDATE tags
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE id = ${tagId}
        RETURNING *;
      `;
    }
    catch (e: any) {
      TagsDatabaseService.handleDatabaseError(e);
    }

    if (result.length > 0) {
      return TagsDatabaseService.mapDatabaseEntity(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning tag after creation",
      })
    }
  }

  async delete(tagId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM tags WHERE id = ${tagId}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while deleting tag",
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
        applicationMessage: "The requested tag could not be found."
      })
    }
  }

  async list(vaultId: string, options: DatabaseListOptions): Promise<TagDto[]> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    let result: DatabaseTagDto[] = [];
    try {
      result = await sql<DatabaseTagDto[]>`SELECT * FROM tags WHERE vault = ${vaultId} ORDER BY ${sql(options.orderBy)} ${options.orderDirection === "ASC" ? sql`ASC` : sql`DESC` } LIMIT ${options.take} OFFSET ${options.skip}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching tags",
        originalError: e
      })
    }

    return result.map(TagsDatabaseService.mapDatabaseEntity);
  }

  async getListMetadata(vaultId: string, options: DatabaseListOptions): Promise<MetaPaginationData> {
    const sql = await this.databaseService.getSQL();

    // todo: this assumes that options.orderBy/options.orderDirection will always be validated etc
    try {
      // Offset and order don't matter for fetching the total count, so we can ignore these for the query.
      const result = await sql`SELECT count(*) FROM tags WHERE id = ${vaultId}`;
      return {
        total: parseInt(result[0].count),
        take: options.take,
        skip: options.skip,
      };
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching tag list metadata",
        originalError: e
      })
    }
  }
}