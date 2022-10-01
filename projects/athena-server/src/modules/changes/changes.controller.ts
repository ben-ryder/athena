import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import { ChangesService } from './changes.service';
import {
    GetUserResponse,
    CreateChangesRequest, ChangesURLParams, ChangeDto
} from "@ben-ryder/athena-js-lib";
import {RequestWithContext} from "../../common/request-with-context";


@Controller({
    path: '/v1/changes',
    identifier: "changes-controller"
})
export class ChangesController {
    constructor(
      private changesService: ChangesService,
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateChangesRequest
    })
    async add(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            await this.changesService.add(req.context.user.id, req.body);
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        httpMethod: HTTPMethods.GET,
        paramsShape: ChangesURLParams
    })
    async list(req: RequestWithContext, res: Response, next: NextFunction) {
        let changes: ChangeDto[];
        const ids = req.params.ids as unknown as string[];

        try {
            changes = await this.changesService.list(req.context.user.id, ids);
        }
        catch (e) {
            return next(e);
        }

        return res.send(changes);
    }

    @Route({
        path: "/ids",
        httpMethod: HTTPMethods.GET,
        paramsShape: ChangesURLParams
    })
    async listIds(req: RequestWithContext, res: Response, next: NextFunction) {
        let ids: string[];

        try {
            ids = await this.changesService.listIds(req.context.user.id);
        }
        catch (e) {
            return next(e);
        }

        return res.send(ids);
    }
}
