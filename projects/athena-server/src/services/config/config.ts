import * as dotenv from 'dotenv';
dotenv.config();

import {Injectable} from "@kangojs/core";

/**
 * The interface that the configuration object (and ConfigService instance attribute ".config") adhere to.
 */
export interface ConfigInterface {
    node: {
        port: number,
        environment: string
    },
    database: {
        url: string
    },
    cache: {
      redisUrl: string
    },
    auth: {
        accessToken: {
            secret: string,
            expiry: string
        },
        refreshToken: {
            secret: string,
            expiry: string
        },
        passwordReset: {
            secret: string,
            expiry: string
        }
    },
    app: {
        registrationEnabled: boolean
    },
    testing: {
        endpointEnabled: boolean,
        key: string
    }
}

/**
 * The raw configuration data.
 *
 * This is created separately to ConfigService, so it can be used in other places such as easily creating a
 * custom config service for testing.
 */
export const config: ConfigInterface = Object.freeze({
    node: {
        port: parseInt(process.env.NODE_PORT as string) || 3000,
        environment: process.env.NODE_ENV || 'production'
    },
    database: {
        url: process.env.DATABASE_URL
    },
    cache: {
        redisUrl: process.env.REDIS_URL
    },
    auth: {
        accessToken: {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiry: process.env.ACCESS_TOKEN_EXPIRY
        },
        refreshToken: {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiry: process.env.REFRESH_TOKEN_EXPIRY
        },
        passwordReset: {
            secret: process.env.PASSWORD_RESET_TOKEN_SECRET,
            expiry: process.env.PASSWORD_RESET_TOKEN_EXPIRY
        }
    },
    app: {
        registrationEnabled: process.env.APP_REGISTRATION_ENABLED === "true"
    },
    testing: {
        endpointEnabled: process.env.TESTTING_ENDPOINT_ENABLED === "true",
        key: process.env.TESTING_ENDPOINT_KEY
    }
} as ConfigInterface)


/**
 * An injectable class version of the configuration.
 */
@Injectable({
    identifier: "config-service",
    injectMode: "singleton"
})
export class ConfigService {
    readonly config: ConfigInterface = config
}
