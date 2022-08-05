import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import {TagsService} from "./tags.service";
import {RequestWithContext} from "../../common/request-with-context";
import {
    CreateTagRequest, CreateTagResponse,
    GetTagResponse, TagsQueryParams,
    TagsURLParams,
    UpdateTagRequest,
    UpdateTagResponse
} from "@ben-ryder/athena-js-lib";


@Controller('/v1/tags',{
    identifier: "tags-controller"
})
export class TagsController {
    constructor(
      private tagsService: TagsService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateTagRequest
    })
    async add(req: RequestWithContext, res: Response, next: NextFunction) {
        let newTag: CreateTagResponse;

        try {
            newTag = await this.tagsService.add(req.context.vaultId, req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newTag);
    }

    @Route({
        path: '/:tagId',
        httpMethod: HTTPMethods.GET,
        paramsShape: TagsURLParams
    })
    async get(req: RequestWithContext, res: Response, next: NextFunction) {
        let tag: GetTagResponse | null;

        try {
            tag = await this.tagsService.getWithAccessCheck(req.context.user.id, req.params.tagId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(tag);
    }

    @Route({
        path: '/:tagId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateTagRequest,
        paramsShape: TagsURLParams
    })
    async update(req: RequestWithContext, res: Response, next: NextFunction) {
        let updatedTag: UpdateTagResponse;

        try {
            updatedTag = await this.tagsService.updateWithAccessCheck(req.context.user.id, req.params.tagId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updatedTag);
    }

    @Route({
        path: '/:tagId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: TagsURLParams
    })
    async delete(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            await this.tagsService.deleteWithAccessCheck(req.context.user.id, req.params.tagId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        httpMethod: HTTPMethods.GET,
        queryShape: TagsQueryParams
    })
    async list(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            const response =  await this.tagsService.listWithAccessCheck(
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
