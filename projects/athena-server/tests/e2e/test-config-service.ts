import {ConfigService, config, ConfigInterface} from "../../src/services/config/config";
import {testEnvironmentVars} from "@ben-ryder/athena-testing";


export class TestConfigService extends ConfigService {
  config: ConfigInterface = {
    ...config,
    auth: {
      accessToken: {
        secret: testEnvironmentVars.ACCESS_TOKEN_SECRET,
        expiry: testEnvironmentVars.ACCESS_TOKEN_EXPIRY
      },
      refreshToken: {
        secret: testEnvironmentVars.REFRESH_TOKEN_SECRET,
        expiry: testEnvironmentVars.REFRESH_TOKEN_EXPIRY
      },
      passwordReset: {
        secret: testEnvironmentVars.PASSWORD_RESET_SECRET,
        expiry: testEnvironmentVars.PASSWORD_RESET_EXPIRY
      }
    },
    database: {
      url: process.env.E2E_TESTING_DATABASE_URL as string
    },
    cache: {
      redisUrl: process.env.E2E_TESTING_REDIS_URL as string
    },
    app: {
      registrationEnabled: testEnvironmentVars.APP_REGISTRATION_ENABLED
    }
  }
}