import {Injectable, AccessForbiddenError, AccessUnauthorizedError} from '@kangojs/core';

import { TokenService } from "../../services/token/token.service";
import { PasswordService } from "../../services/password/password.service";

import { UsersService } from "../users/users.service";
import {DatabaseUserDto, LoginResponse, RefreshResponse, RevokeRequest} from "@ben-ryder/athena-js-lib";
import {AthenaErrorIdentifiers} from "@ben-ryder/athena-js-lib";


@Injectable({
  identifier: "auth-service"
})
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService
    ) {}

    async login(username: string, password: string): Promise<LoginResponse> {
       let user: DatabaseUserDto;

       try {
           user = await this.usersService.getWithPasswordByUsername(username);
       }
       catch (e) {
           throw new AccessForbiddenError({
             identifier: AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       const passwordValid = await PasswordService.checkPassword(password, user.passwordHash);
       if (!passwordValid) {
         throw new AccessForbiddenError({
           identifier: AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
           message: 'The supplied username & password combination is invalid.',
           applicationMessage: 'The supplied username & password combination is invalid.'
         });
       }

       const userDto = this.usersService.removePasswordFromUser(user);
       const tokenPair = this.tokenService.createTokenPair(user);

       return {
         user: userDto,
         ...tokenPair
       };
    }

    async revokeTokens(tokens: RevokeRequest) {
      let blacklistedAccessToken: string | null = null;
      let blacklistedRefreshToken: string | null = null;

      if (tokens.refreshToken) {
        let isSignedToken = await this.tokenService.isSignedRefreshToken(tokens.refreshToken);
        if (!isSignedToken) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            applicationMessage: "The supplied refresh token is invalid."
          })
        }

        let isValidToken = await this.tokenService.isValidRefreshToken(tokens.refreshToken);
        if (isValidToken) {
          blacklistedRefreshToken = tokens.refreshToken;
        }
      }

      if (tokens.accessToken) {
        let isSignedToken = await this.tokenService.isSignedAccessToken(tokens.accessToken);

        if (!isSignedToken) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            applicationMessage: "The supplied access token is invalid."
          })
        }

        let isValidToken = await this.tokenService.isValidAccessToken(tokens.accessToken);
        if (isValidToken) {
          blacklistedAccessToken = tokens.accessToken;
        }
      }

      if (blacklistedRefreshToken) {
        await this.tokenService.addTokenToBlacklist(blacklistedRefreshToken);
      }
      if (blacklistedAccessToken) {
        await this.tokenService.addTokenToBlacklist(blacklistedAccessToken);
      }
    }

    async refresh(refreshToken: string): Promise<RefreshResponse> {
        const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

        if (!tokenPayload) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            message: 'The supplied refresh token is invalid.',
            applicationMessage: 'The supplied refresh token is invalid.'
          });
        }

        // As the token has been validated the supplied userId in the token can be trusted
        const userDto = await this.usersService.get(tokenPayload.userId);

        await this.tokenService.addTokenToBlacklist(refreshToken);
        return this.tokenService.createTokenPair(userDto);
    }
}
