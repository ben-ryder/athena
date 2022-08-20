import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import {TemplatesService} from "./templates.service";
import {RequestWithContext} from "../../common/request-with-context";
import {
    CreateTemplateRequest, CreateTemplateResponse,
    GetTemplateResponse, TemplatesQueryParams,
    TemplatesURLParams,
    UpdateTemplateRequest, UpdateTemplateResponse
} from "@ben-ryder/athena-js-lib";


@Controller({
    path: '/v1/vaults/:vaultId/templates',
    identifier: "templates-controller"
})
export class TemplatesController {
    constructor(
      private templatesService: TemplatesService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateTemplateRequest
    })
    async add(req: RequestWithContext, res: Response, next: NextFunction) {
        let newTemplate: CreateTemplateResponse;

        try {
            newTemplate = await this.templatesService.add(req.context.user.id, req.params.vaultId, req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newTemplate);
    }

    @Route({
        path: '/:templateId',
        httpMethod: HTTPMethods.GET,
        paramsShape: TemplatesURLParams
    })
    async get(req: RequestWithContext, res: Response, next: NextFunction) {
        let template: GetTemplateResponse | null;

        try {
            template = await this.templatesService.getWithAccessCheck(req.context.user.id, req.params.templateId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(template);
    }

    @Route({
        path: '/:templateId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateTemplateRequest,
        paramsShape: TemplatesURLParams
    })
    async update(req: RequestWithContext, res: Response, next: NextFunction) {
        let updateTemplate: UpdateTemplateResponse;

        try {
            updateTemplate = await this.templatesService.updateWithAccessCheck(req.context.user.id, req.params.templateId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updateTemplate);
    }

    @Route({
        path: '/:templateId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: TemplatesURLParams
    })
    async delete(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            await this.templatesService.deleteWithAccessCheck(req.context.user.id, req.params.templateId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        httpMethod: HTTPMethods.GET,
        queryShape: TemplatesQueryParams
    })
    async list(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            const response =  await this.templatesService.listWithAccessCheck(
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
