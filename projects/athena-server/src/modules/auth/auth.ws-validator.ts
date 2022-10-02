import {Socket} from "socket.io";

import {
  AccessForbiddenError,
  AccessUnauthorizedError,
  Injectable,
  SocketMiddlewareFactory,
  SocketNextFunction
} from '@kangojs/core';
import { TokenService } from '../../services/token/token.service';
import {AthenaErrorIdentifiers} from "@ben-ryder/athena-js-lib";


@Injectable({
  identifier: "auth-websocket-validator"
})
export class AuthWebsocketValidator implements SocketMiddlewareFactory {
  constructor(
    private tokenService: TokenService
  ) {}

  async run(socket: Socket, next: SocketNextFunction) {
    const accessToken = socket.handshake.auth.accessToken;

    if (!accessToken) {
      return next(
        new AccessUnauthorizedError({
          message: 'Access Denied'
        })
      )
    }

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

        return next();
      }
      else {
        return next(new Error("An error occurred, please try again later."))
      }
    }
    catch (e) {
      return next(new Error("An error occurred, please try again later."))
    }
  }
}
