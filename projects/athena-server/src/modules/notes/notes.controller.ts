import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import {
    CreateNoteRequest, GetNoteResponse, NotesURLParams, UpdateNoteRequest, CreateNoteResponse, NotesQueryParams, UpdateNoteResponse
} from "@ben-ryder/athena-js-lib";
import {NotesService} from "./notes.service";
import {RequestWithContext} from "../../common/request-with-context";


@Controller({
    path: '/v1/vaults/:vaultId/notes',
    identifier: "notes-controller"
})
export class NotesController {
    constructor(
      private notesService: NotesService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateNoteRequest
    })
    async add(req: RequestWithContext, res: Response, next: NextFunction) {
        let newNote: CreateNoteResponse;

        try {
            newNote = await this.notesService.add(req.context.user.id, req.params.vaultId, req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newNote);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.GET,
        paramsShape: NotesURLParams
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
        bodyShape: UpdateNoteRequest,
        paramsShape: NotesURLParams
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
        paramsShape: NotesURLParams
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
        queryShape: NotesQueryParams
    })
    async list(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            const response =  await this.notesService.listWithAccessCheck(
              req.context.user.id,
              req.params.vaultId,
              req.query
            );
            return res.send(response);
        }
        catch (e) {
            return next(e);
        }
    }
}
