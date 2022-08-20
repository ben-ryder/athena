import { Request, Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods, AccessForbiddenError} from '@kangojs/core';

import { UsersService } from './users.service';
import {
    AthenaErrorIdentifiers,
    CreateUserRequest, UpdateUserRequest, UsersURLParams,
    GetUserResponse,UpdateUserResponse,
    UserDto
} from "@ben-ryder/athena-js-lib";
import {RequestWithContext} from "../../common/request-with-context";
import {ConfigService} from "../../services/config/config";
import {TokenPair, TokenService} from "../../services/token/token.service";


@Controller({
    path: '/v1/users',
    identifier: "users-controller"
})
export class UsersController {
    constructor(
      private configService: ConfigService,
      private usersService: UsersService,
      private tokenService: TokenService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserRequest,
        authRequired: false
    })
    async add(req: Request, res: Response, next: NextFunction) {
        let newUser: UserDto;
        let tokens: TokenPair;

        if (!this.configService.config.app.registrationEnabled) {
            throw new AccessForbiddenError({
                identifier: AthenaErrorIdentifiers.USER_REGISTRATION_DISABLED,
                applicationMessage: "User registration is currently disabled."
            })
        }

        try {
            newUser = await this.usersService.add(req.body);
            tokens = await this.tokenService.createTokenPair(newUser);
        }
        catch(e) {
            return next(e);
        }

        return res.send({
            user: newUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.GET,
        paramsShape: UsersURLParams
    })
    async get(req: RequestWithContext, res: Response, next: NextFunction) {
        let user: GetUserResponse | null;

        try {
            user = await this.usersService.getWithAccessCheck(req.context.user.id, req.params.userId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(user);
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateUserRequest,
        paramsShape: UsersURLParams
    })
    async update(req: RequestWithContext, res: Response, next: NextFunction) {
        let updatedUser: UpdateUserResponse;

        try {
            updatedUser = await this.usersService.updateWithAccessCheck(req.context.user.id, req.params.userId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updatedUser);
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: UsersURLParams
    })
    async delete(req: RequestWithContext, res: Response, next: NextFunction) {
        try {
            await this.usersService.deleteWithAccessCheck(req.context.user.id, req.params.userId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
