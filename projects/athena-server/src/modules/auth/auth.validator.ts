import { NextFunction, Request, Response } from 'express';

import {AccessForbiddenError, AccessUnauthorizedError, Middleware} from '@kangojs/core';
import { TokenService } from '../../services/token/token.service';
import  {MiddlewareFactory } from "@kangojs/core";
import {AthenaErrorIdentifiers} from "@ben-ryder/athena-js-lib";


@Middleware({
  identifier: "auth-validator-middleware"
})
export class AuthValidator implements MiddlewareFactory {
  constructor(
    private tokenService: TokenService
  ) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<any> {
    const authorizationHeader = req.header('authorization');

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];

      try {
        const accessTokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

        if (accessTokenPayload) {
          if (!accessTokenPayload.userIsVerified) {
            return next(
              new AccessForbiddenError({
                identifier: AthenaErrorIdentifiers.AUTH_EMAIL_NOT_VERIFIED,
                applicationMessage: 'You must verify your account email before you can use Athena.'
              })
            )
          }

          // todo: better way to handle req schemas and adding new attribute?
          // @ts-ignore
          if (req.context) {
            // @ts-ignore
            req.context.user = {
              id: accessTokenPayload.userId,
              isVerified: accessTokenPayload.userIsVerified
            }
          }
          else {
            // @ts-ignore
            req.context = {
              user: {
                id: accessTokenPayload.userId,
                isVerified: accessTokenPayload.userIsVerified
              }
            }
          }

          return next();
        }
      }
      catch (e) {
        return next(e);
      }
    }

    return next(
      new AccessUnauthorizedError({
        message: 'Request Access Denied'
      })
    )
  }
}
