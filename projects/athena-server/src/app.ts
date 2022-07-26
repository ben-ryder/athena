import {KangoJS} from '@kangojs/core'
import {AuthValidator} from './modules/auth/auth.validator';
import { createServeSPAMiddleware } from "@kangojs/serve-spa";

import {AuthController} from "./modules/auth/auth.controller";
import {BaseController} from "./modules/base/base.controller";
import {UsersController} from "./modules/users/users.controller";
import {VaultsController} from "./modules/vaults/vaults.controller";
import {ZodValidator} from "@kangojs/zod-validation";


export async function createApp() {
  const serveSpaMiddleware = createServeSPAMiddleware({
    folderPath: "../../dashboard/build"
  });

  // Load all controllers and setup KangoJS.
  return new KangoJS({
    controllers: [
      BaseController,
      AuthController,
      UsersController,
      VaultsController
    ],
    middleware: [
      serveSpaMiddleware
    ],
    authValidator: AuthValidator,
    bodyValidator: ZodValidator,
    queryValidator: ZodValidator,
    paramsValidator: ZodValidator,
  });
}
