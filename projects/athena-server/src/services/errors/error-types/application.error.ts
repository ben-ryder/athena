/**
 * The config passed to all application errors.
 *
 * message: The actual error message (default Error property).
 * applicationMessage: A custom error message that can be USER FACING in API responses.
 * originalError: The original error that was caught if applicable.
 *
 * The 'applicationMessage' property forces user facing error messages to be explicitly
 * defined in an attempt to prevent accidentally leaking error information that shouldn't
 * be returned to a user.
 *
 * The originalError property offers the chance to ensure no error details are lost when catching
 * an error and throwing an ApplicationError instance instead.
 */
export interface ErrorConfig {
  message: string,
  applicationMessage?: string,
  originalError?: any
}

/**
 * The generic parent of all custom application errors.
 */
export class ApplicationError extends Error {
  applicationMessage: string|null;
  originalError: any;

  constructor(config: ErrorConfig) {
    super(config.message);

    this.applicationMessage = config.applicationMessage || null;
    this.originalError = config.originalError || null;
  }
}
