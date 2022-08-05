import {AccessForbiddenError, Injectable} from "@kangojs/core";
import {NotesDatabaseService} from "./database/notes.database.service";
import {
  CreateNoteRequest,
  GetNoteResponse, GetNotesResponse,
  NoteDto, NotesQueryParams, UpdateNoteRequest, UpdateVaultRequest
} from "@ben-ryder/athena-js-lib";
import {DefaultVaultsListOptions} from "@ben-ryder/athena-js-lib";
import {DatabaseListOptions} from "../../common/database-list-options";


@Injectable({
  identifier: "notes-service"
})
export class NotesService {
  constructor(
    private notesDatabaseService: NotesDatabaseService
  ) {}

  async checkAccess(requestUserId: string, noteId: string): Promise<void> {
    const note = await this.notesDatabaseService.getWithOwner(noteId);

    if (note.owner === requestUserId) {
      return;
    }

    throw new AccessForbiddenError({
      message: "Access forbidden to note"
    })
  }

  async get(noteId: string): Promise<GetNoteResponse> {
    return await this.notesDatabaseService.get(noteId);
  }

  async getWithAccessCheck(requestUserId: string, noteId: string): Promise<GetNoteResponse> {
    await this.checkAccess(requestUserId, noteId);
    return this.get(noteId);
  }

  async add(ownerId: string, createNoteDto: CreateNoteRequest): Promise<NoteDto> {
    return await this.notesDatabaseService.create(ownerId, createNoteDto);
  }

  async update(noteId: string, noteUpdate: UpdateNoteRequest): Promise<NoteDto> {
    return await this.notesDatabaseService.update(noteId, noteUpdate)
  }

  async updateWithAccessCheck(requestUserId: string, noteId: string, noteUpdate: UpdateNoteRequest): Promise<NoteDto> {
    await this.checkAccess(requestUserId, noteId);
    return this.update(noteId, noteUpdate);
  }

  async delete(noteId: string): Promise<void> {
    return this.notesDatabaseService.delete(noteId);
  }

  async deleteWithAccessCheck(requestUserId: string, noteId: string): Promise<void> {
    await this.checkAccess(requestUserId, noteId);
    return this.delete(noteId);
  }

  async listWithAccessCheck(ownerId: string, noteId: string, options: NotesQueryParams): Promise<GetNotesResponse> {
    const processedOptions: DatabaseListOptions = {
      skip: options.skip || DefaultVaultsListOptions.skip,
      take: options.take || DefaultVaultsListOptions.take,
      orderBy: options.orderBy || DefaultVaultsListOptions.orderBy,
      orderDirection: options.orderDirection || DefaultVaultsListOptions.orderDirection
    };

    const notes = await this.notesDatabaseService.list(ownerId, processedOptions);
    const meta = await this.notesDatabaseService.getListMetadata(ownerId, processedOptions);

    return {
      notes,
      meta
    }
  }
}
