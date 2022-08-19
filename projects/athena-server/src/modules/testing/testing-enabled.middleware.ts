import { NextFunction, Request, Response } from 'express';

import {AccessForbiddenError, AccessUnauthorizedError, Middleware, ResourceNotFoundError} from '@kangojs/core';
import { TokenService } from '../../services/token/token.service';
import  {MiddlewareFactory } from "@kangojs/core";
import {AthenaErrorIdentifiers} from "@ben-ryder/athena-js-lib";
import {ConfigService} from "../../services/config/config";


@Middleware({
  identifier: "testing-enabled-middleware"
})
export class TestingEnabledMiddleware implements MiddlewareFactory {
  constructor(
    private configService: ConfigService
  ) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<any> {
    if (!this.configService.config.testing.endpointEnabled) {
      new ResourceNotFoundError({
        message: 'Testing Endpoint Disabled'
      })
    }

    const testingKey = req.header('testing-key');

    if (testingKey === this.configService.config.testing.key) {
      return next();
    }

    return next(
      new AccessUnauthorizedError({
        message: 'Testing Endpoint Access Denied'
      })
    )
  }
}
