export enum LocalfulErrorIdentifiers {
    SERVER_NOT_INITIALISED = "SERVER_NOT_INITIALISED",
    MISSING_REFRESH_TOKEN = "MISSING_REFRESH_TOKEN",
    MISSING_AUTH_TOKEN = "MISSING_AUTH_TOKEN",
    REQUEST_ERROR = "REQUEST_ERROR",
}

export interface LocalfulErrorOptions {
    identifier: LocalfulErrorIdentifiers
    message?: string;
    originalError?: any;
}

export class LocalfulError extends Error {
    originalError: any;

    constructor(options?: LocalfulErrorOptions) {
        if (options?.message) {
            super(options.message);
        }
        else {
            super();
        }

        this.originalError = options?.originalError || null;
    }
}

export class NoServerError extends LocalfulError {}

// Encryption Errors
export class EncryptionError extends LocalfulError {}
export class EncryptError extends EncryptionError {}
export class DecryptError extends EncryptionError {}

// API Client Errors
export class APIClientError extends LocalfulError {}
export class NoEncryptionKeyError extends APIClientError {}

export interface RequestErrorOptions extends LocalfulErrorOptions {
    response?: any
}

export class RequestError extends APIClientError {
    response: any;

    constructor(options?: RequestErrorOptions) {
        super(options);
        this.response = options?.response;
    }
}

// Data save/load errors
export class DataLoadError extends APIClientError {}
export class DataSaveError extends APIClientError {}
export class DataDeleteError extends APIClientError {}
