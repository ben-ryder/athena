import {KangoJS} from '@kangojs/core'
import {AuthValidator} from './modules/auth/auth.validator';

import {AuthController} from "./modules/auth/auth.controller";
import {BaseController} from "./modules/base/base.controller";
import {UsersController} from "./modules/users/users.controller";
import {ZodValidator} from "@kangojs/zod-validation";
import {InfoController} from "./modules/info/info.controller";
import {TestingController} from "./modules/testing/testing.controller";


export async function createApp() {
  // Load all controllers and setup KangoJS.
  return new KangoJS({
    controllers: [
      BaseController,
      InfoController,
      AuthController,
      UsersController,
      TestingController
    ],
    authValidator: AuthValidator,
    bodyValidator: ZodValidator,
    queryValidator: ZodValidator,
    paramsValidator: ZodValidator,
  });
}
