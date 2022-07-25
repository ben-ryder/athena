export interface AthenaErrorOptions {
    message?: string;
    originalError?: any;
}

export class AthenaError extends Error {
    originalError: any;

    constructor(options?: AthenaErrorOptions) {
        if (options?.message) {
            super(options.message);
        }
        else {
            super();
        }

        this.originalError = options?.originalError || null;
    }
}

// Encryption Errors
export class AthenaEncryptionError extends AthenaError {}
export class AthenaEncryptError extends AthenaEncryptionError {}
export class AthenaDecryptError extends AthenaEncryptionError {}

// API Client Errors
export class AthenaAPIClientError extends AthenaError {}
export class AthenaNoEncryptionKeyError extends AthenaAPIClientError {}

export interface AthenaRequestErrorOptions {
    message?: string;
    originalError?: any;
    response?: any
}

export class AthenaRequestError extends AthenaAPIClientError {
    response: any;

    constructor(options?: AthenaRequestErrorOptions) {
        super(options);
        this.response = options?.response;
    }
}

export class AthenaNoRefreshTokenError extends AthenaAPIClientError {}
export class AthenaNoAccessTokenError extends AthenaAPIClientError {}

// Data save/load errors
export class AthenaDataLoadError extends AthenaAPIClientError {}
export class AthenaDataSaveError extends AthenaAPIClientError {}
export class AthenaDataDeleteError extends AthenaAPIClientError {}
