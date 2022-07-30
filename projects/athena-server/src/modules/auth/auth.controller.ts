import {Controller, Route, HTTPMethods, HTTPStatusCodes} from '@kangojs/core';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from './auth.service';
import {
    LoginRequest,
    LoginRequestSchema, RefreshRequest,
    RefreshRequestSchema,
    RevokeRequest,
    RevokeRequestSchema
} from "@ben-ryder/athena-js-lib";


@Controller('/v1/auth', {
    identifier: "auth-controller"
})
export class AuthController {
    constructor(
      private authService: AuthService
    ) {}

    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
        bodyShape: LoginRequestSchema,
        authRequired: false
    })
    async login(req: Request, res: Response, next: NextFunction) {
        const loginDetails = <LoginRequest> req.body;

        try {
            const loginResponse = await this.authService.login(loginDetails.username, loginDetails.password);
            return res.send(loginResponse);
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/revoke',
        httpMethod: HTTPMethods.POST,
        bodyShape: RevokeRequestSchema,
        authRequired: false
    })
    async revoke(req: Request, res: Response, next: NextFunction) {
        const tokens = <RevokeRequest> req.body;

        try {
            await this.authService.revokeTokens(tokens);
            return res.send({});
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/refresh',
        httpMethod: HTTPMethods.POST,
        bodyShape: RefreshRequestSchema,
        authRequired: false
    })
    async refresh(req: Request, res: Response, next: NextFunction) {
        const bodyData = <RefreshRequest> req.body;

        try {
            const tokens = await this.authService.refresh(bodyData.refreshToken);
            return res.send(tokens);
        }
        catch(e) {
            return next(e);
        }
    }

    /**
     * An empty endpoint which can be used to check if your auth credentials are valid.
     *
     * @param req
     * @param res
     * @param next
     */
    @Route({
        path: '/check',
        httpMethod: HTTPMethods.GET
    })
    async check(req: Request, res: Response, next: NextFunction) {
        return res.send({});
    }

    /**
     * An endpoint where users can request password reset emails.
     * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
     *
     * @param req
     * @param res
     * @param next
     */
    @Route({
        path: '/password-reset',
        httpMethod: HTTPMethods.POST,
        authRequired: false
    })
    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        return res.status(HTTPStatusCodes.NOT_IMPLEMENTED).send({
            statusCode: HTTPStatusCodes.NOT_IMPLEMENTED,
            message: "Password resets have not been implemented yet"
        });
    }

    /**
     * An endpoint to check if the given password reset token is valid.
     * This is useful as it allows quick user feedback in case the token has expired etc.
     *
     * @param req
     * @param res
     * @param next
     */
    @Route({
        path: '/password-reset/check',
        httpMethod: HTTPMethods.POST,
        authRequired: false
    })
    async checkPasswordResetToken(req: Request, res: Response, next: NextFunction) {
        return res.status(HTTPStatusCodes.NOT_IMPLEMENTED).send({
            statusCode: HTTPStatusCodes.NOT_IMPLEMENTED,
            message: "Password resets have not been implemented yet"
        });
    }

    /**
     * An endpoint where users can request password reset emails.
     * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
     *
     * @param req
     * @param res
     * @param next
     */
    @Route({
        path: '/password-reset/change',
        httpMethod: HTTPMethods.POST,
        authRequired: false
    })
    async requestPasswordChange(req: Request, res: Response, next: NextFunction) {
        return res.status(HTTPStatusCodes.NOT_IMPLEMENTED).send({
            statusCode: HTTPStatusCodes.NOT_IMPLEMENTED,
            message: "Password resets have not been implemented yet"
        });
    }
    // todo: add password reset functionality to API
}
