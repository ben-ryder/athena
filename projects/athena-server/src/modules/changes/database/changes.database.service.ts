import {Injectable, ResourceNotFoundError, SystemError} from "@kangojs/core";
import {DatabaseService} from "../../../services/database/database.service";
import {
  AthenaErrorIdentifiers, ChangeDto, InternalDatabaseChangeDto, ListOptions,
} from "@ben-ryder/athena-js-lib";

interface ChangeId {
  id: string
}


@Injectable()
export class ChangesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static convertDatabaseDtoToDto(change: InternalDatabaseChangeDto): ChangeDto {
    return {
      id: change.id,
      data: change.data,
    }
  }

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing change query",
      originalError: e
    })
  }

  async add(owner: string, changes: ChangeDto[]) {
    const sql = await this.databaseService.getSQL();

    try {
      for (const change of changes) {
        await sql`
        INSERT INTO changes(id, data, owner) 
        VALUES (DEFAULT, ${change.id}, ${change.data}, ${owner})
       `;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }
  }

  async list(owner: string, ids: string[]): Promise<ChangeDto[]> {
    const sql = await this.databaseService.getSQL();

    let results: InternalDatabaseChangeDto[] = [];
    try {
      results = await sql<InternalDatabaseChangeDto[]>`SELECT * FROM changes WHERE owner = ${owner}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching changes",
        originalError: e
      })
    }

    return results.map(ChangesDatabaseService.convertDatabaseDtoToDto);
  }

  async listIds(owner: string): Promise<string[]> {
    const sql = await this.databaseService.getSQL();

    let results: ChangeId[] = [];
    try {
      results = await sql<ChangeId[]>`SELECT id FROM changes WHERE owner = ${owner}`;
    }
    catch (e: any) {
      throw new SystemError({
        message: "Unexpected error while fetching changes",
        originalError: e
      })
    }

    return results.map(result => result.id);
  }
}
