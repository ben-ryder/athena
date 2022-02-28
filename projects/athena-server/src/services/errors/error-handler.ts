import { Response } from 'express';

import { Logger } from '../logging/logger';
import { ApplicationError } from './error-types/application.error';
import { ResponseManager } from './response-manager';
import { DatabaseRelationshipError } from './error-types/database-relationship.error';
import { ContentNotFoundError } from './error-types/content-not-found.error';
import { ContentUniquenessError } from './error-types/content-uniqueness.error';


class ErrorHandler {
  constructor(
    private readonly _logger: Logger = new Logger(),
    private readonly _responseManager = new ResponseManager(),
    private readonly _safeErrors = [
      'DatabaseRelationshipError',
      'ContentNotFoundError',
      'ContentUniquenessError'
    ]
  ) {
    this.setupProcessCatches();
  }

  setupProcessCatches() {
    process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
      throw reason;
    });

    process.on('uncaughtException', async (error: Error) => {
      await this.handleError(error);
      await this._handleUnexpectedError();
    });
  }

  async handleError(error: Error, res?: Response) {
    // Only log the error if it isn't safe to ignore.
    if (!this.isSafeError(error)) {
      await this._logger.logError(error);
    }

    // If the error isn't a purposeful error, handle it specifically.
    if (!(error instanceof ApplicationError)) {
      await this._handleUnexpectedError();
    }

    if (res) {
      await this._responseManager.sendErrorResponse(error, res);
    }
  }

  async _handleUnexpectedError() {
    // If an error wasn't expected force the process to exit to
    // try and stop any unexpected side effects from occurring.
    process.exit(1);
  }

  isSafeError(err: Error): boolean {
    return this._safeErrors.includes(err.constructor.name);
  }
}

export default new ErrorHandler();
