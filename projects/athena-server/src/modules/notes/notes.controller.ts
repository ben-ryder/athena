import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import {
    CreateNoteRequestSchema, GetNoteResponse, NotesURLParamsSchema, UpdateNoteRequestSchema
} from "@ben-ryder/athena-js-lib";
import {NotesService} from "./notes.service";
import {RequestWithContext} from "../../common/request-with-context";
import {CreateNoteResponse, NotesQueryParamsSchema, UpdateNoteResponse} from "@ben-ryder/athena-js-lib/src";


@Controller('/v1/notes',{
    identifier: "notes-controller"
})
export class NotesController {
    constructor(
      private notesService: NotesService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateNoteRequestSchema
    })
    async add(req: RequestWithContext, res: Response, next: NextFunction) {
        let newNote: CreateNoteResponse;

        try {
            newNote = await this.notesService.add(req.context.vaultId, req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newNote);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.GET,
        paramsShape: NotesURLParamsSchema
    })
    async get(req: RequestWithContext, res: Response, next: NextFunction) {
        let note: GetNoteResponse | null;

        try {
            note = await this.notesService.getWithAccessCheck(req.context.user.id, req.params.noteId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(note);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateNoteRequestSchema,
        paramsShape: NotesURLParamsSchema
    })
    async update(req: RequestWithContext, res: Response, next: NextFunction) {
        let updatedNote: UpdateNoteResponse;

        try {
            updatedNote = await this.notesService.updateWithAccessCheck(req.context.user.id, req.params.noteId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updatedNote);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: NotesURLParamsSchema
    })
    async delete(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            await this.notesService.deleteWithAccessCheck(req.context.user.id, req.params.noteId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        httpMethod: HTTPMethods.GET,
        queryShape: NotesQueryParamsSchema
    })
    async list(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            const response =  await this.notesService.listWithAccessCheck(
              req.context.user.id,
              req.context.vaultId,
              req.params
            );
            return res.send(response);
        }
        catch (e) {
            return next(e);
        }
    }
}
