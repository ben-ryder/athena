import { Repository, SelectQueryBuilder } from 'typeorm';

import { databaseServiceInstance, DatabaseService } from 'src/services/database/database.service';

import { NoteEntity } from "./notes.database.entity";
import { CreateNoteDto } from "../dtos/create.notes.dto";
import { NoteDto } from "../dtos/notes.dto";

import { DatabaseError } from '../../../services/errors/error-types/database.error';
import {
    ContentNotFoundError
} from '../../../services/errors/error-types/content-not-found.error';
import { DatabaseErrorCodes } from '../../../services/database/database-error-codes';
import { DatabaseRelationshipError } from '../../../services/errors/error-types/database-relationship.error';
import { ContentUniquenessError } from '../../../services/errors/error-types/content-uniqueness.error';
import {UpdateNoteDto} from "../dtos/update.notes.dto";


export class NotesDatabaseRepository {
    constructor(
        private db: DatabaseService = databaseServiceInstance
    ) {}

    private async getRepository(): Promise<Repository<NoteEntity>> {
        const connection = await this.db.getConnection();
        return connection.getRepository(NoteEntity);
    }

    async add(note: CreateNoteDto): Promise<NoteDto> {
        const repo = await this.getRepository();

        const noteToSave = <NoteEntity> {
            title: note.title,
            body: note.body || null,
            user: note.userId ? {id: note.userId} : null
        }

        const newNote = repo.create(noteToSave);
        let savedNote: NoteEntity;

        try {
            savedNote = await repo.save(newNote);
        }
        catch (e: any) {
            if (e.errno === DatabaseErrorCodes.FOREIGN_KEY_INVALID) {
                throw new DatabaseRelationshipError({
                    message: e.message,
                    applicationMessage: 'You have tried to add a relationship with an entity that doesn\'t exist',
                    originalError: e,
                });
            }
            else if (e.message && e.message.includes("Duplicate entry")) {
                throw new ContentUniquenessError({
                    message: e.message,
                    applicationMessage: 'You have tried to add an entity that is not unique.',
                    originalError: e,
                })
            }

            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to save the entity.',
                originalError: e,
            });
        }

        return savedNote;
    }

    async get(noteId: string): Promise<NoteDto|null> {
        const repo = await this.getRepository();

        let result: NoteEntity | undefined;

        try {
            result = await repo.findOne({id: noteId});
        }
        catch(e: any) {
            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to fetch the results.',
                originalError: e,
            });
        }

        return result || null;
    }

    async getAll(): Promise<NoteDto[]> {
        const repo = await this.getRepository();

        let result: NoteEntity[];

        try {
            result = await repo.find();
        }
        catch(e: any) {
            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to fetch the results.',
                originalError: e,
            });
        }

        return result;
    }

    async update(noteId: string, updateNoteDto: UpdateNoteDto): Promise<void> {
        const repo = await this.getRepository();

        let note;
        try {
            note = await repo.findOne(noteId);
        }
        catch (e: any) {
            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to get the entity to update.',
                originalError: e,
            });
        }

        if(!note) {
            throw new ContentNotFoundError({
                message: 'The requested entity to update could not be found.',
                applicationMessage: 'The requested entity to update could not be found.',
            });
        }

        const updatedNote = <any>{
            ...note,
            ...updateNoteDto,
        }

        try {
            await repo.save(updatedNote);
        }
        catch (e: any) {
            if (e.errno === DatabaseErrorCodes.FOREIGN_KEY_INVALID) {
                throw new DatabaseRelationshipError({
                    message: e.message,
                    applicationMessage: 'You have tried to add a relationship with an entity that doesn\'t exist',
                    originalError: e,
                });
            }
            else if (e.message && e.message.includes("Duplicate entry")) {
                throw new ContentUniquenessError({
                    message: e.message,
                    applicationMessage: 'You have tried to make an update that would cause the entity to stop being unique.',
                    originalError: e,
                })
            }

            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to save the updated entity.',
                originalError: e,
            });
        }
    }

    async delete(noteId: string): Promise<void> {
        const repo = await this.getRepository();

        let note;
        try {
            note = await repo.findOne(noteId);
        }
        catch (e: any) {
            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to get the entity to delete.',
                originalError: e,
            });
        }

        if(!note) {
            throw new ContentNotFoundError({
                message: 'The requested entity to delete could not be found.',
                applicationMessage: 'The requested entity to delete could not be found.',
            });
        }

        try {
            await repo.remove(note);
        }
        catch (e: any) {
            throw new DatabaseError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to delete the entity.',
                originalError: e,
            });
        }
    }
}
