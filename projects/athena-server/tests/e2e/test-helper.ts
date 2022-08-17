import {TokenPair, TokenService} from "../../src/services/token/token.service";
import {DatabaseService} from "../../src/services/database/database.service";
import {resetDatabase} from "@ben-ryder/athena-testing";
import {createServeSPAMiddleware} from "@kangojs/serve-spa";
import {ConfigService} from "../../src/services/config/config";
import {BaseController} from "../../src/modules/base/base.controller";
import {AuthController} from "../../src/modules/auth/auth.controller";
import {UsersController} from "../../src/modules/users/users.controller";
import {AuthValidator} from "../../src/modules/auth/auth.validator";
import {ZodValidator} from "@kangojs/zod-validation";
import {TestConfigService} from "./test-config-service";
import {KangoJS} from "@kangojs/core";
import {SuperAgentTest, agent} from "supertest";
import {CacheService} from "../../src/services/cache/cache.service";
import {UserDto} from "@ben-ryder/athena-js-lib";
import {VaultsController} from "../../src/modules/vaults/vaults.controller";
import {InfoController} from "../../src/modules/info/info.controller";

/**
 * This class encapsulates all the test specific application functionality that is required.
 */
export class TestHelper {
  application: KangoJS;
  client: SuperAgentTest;

  constructor() {
    const serveSpaMiddleware = createServeSPAMiddleware({
      folderPath: "../../dashboard/build"
    });

    this.application = new KangoJS({
      dependencyOverrides: [
        {
          original: ConfigService,
          override: TestConfigService
        }
      ],
      controllers: [
        BaseController,
        InfoController,
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
      paramsValidator: ZodValidator
    });

    const expressApp = this.application.getApp();
    this.client = agent(expressApp)
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserAccessToken(user: UserDto): string {
    return this.getUserTokens(user).accessToken;
  }

  /**
   * Return an API access token for the given user
   *
   * @param user
   */
  getUserTokens(user: UserDto): TokenPair {
    const tokenService = this.application.dependencyContainer.useDependency(TokenService);
    return tokenService.createTokenPair(user);
  }

  /**
   * Reset the internal to match the predefined test content
   */
  async resetDatabase() {
    const databaseService = this.application.dependencyContainer.useDependency(DatabaseService);
    const sql = await databaseService.getSQL();
    await resetDatabase(sql);
  }

  async killApplication() {
    // Clean up internal and redis connections before exiting
    const cacheService = this.application.dependencyContainer.useDependency(CacheService);
    await cacheService.onKill();
    const databaseService = this.application.dependencyContainer.useDependency(DatabaseService);
    await databaseService.onKill();
  }

  async beforeEach() {
    await this.resetDatabase();

    // Purge the cache service to ensure things like refresh/access tokens aren't persisted
    const cacheService = this.application.dependencyContainer.useDependency(CacheService);
    await cacheService.purge();
  }

  async afterAll() {
    await this.killApplication();
  }
}