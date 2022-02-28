import { Response } from 'express';
import { HTTPStatusCodes } from '@kangojs/http-status-codes';
import { UserRequestError } from './error-types/user-request.error';
import { DatabaseError } from './error-types/database.error';
import { ApplicationError } from './error-types/application.error';
import { ContentNotFoundError } from './error-types/content-not-found.error';
import { DatabaseRelationshipError } from './error-types/database-relationship.error';

/**
 * Default error mapping for status code & messages.
 */
const errorMappings = {
  contentNotFound: {
    statusCode: HTTPStatusCodes.NOT_FOUND,
    message: "The requested content could not be found.",
  },
  userRequest: {
    statusCode: HTTPStatusCodes.BAD_REQUEST,
    message: "There was something wrong with your request.",
  },
  database: {
    statusCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred while processing your request.",
  },
  databaseRelationship: {
    statusCode: HTTPStatusCodes.BAD_REQUEST,
    message: "There was something wrong with your request.",
  },
  application: {
    statusCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred while processing your request.",
  },
  unknown: {
    statusCode: HTTPStatusCodes.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred while processing your request.",
  }
};


class ResponseManager {
  async sendErrorResponse(err: Error, res: Response) {
    if (err instanceof ContentNotFoundError) {
      return res.status(errorMappings.contentNotFound.statusCode).send({
        statusCode: errorMappings.contentNotFound.statusCode,
        message: err.applicationMessage || errorMappings.contentNotFound.message
      })
    }
    else if (err instanceof UserRequestError) {
      return res.status(errorMappings.userRequest.statusCode).send({
        statusCode: errorMappings.userRequest.statusCode,
        message: err.applicationMessage || errorMappings.userRequest.message
      })
    }
    else if (err instanceof DatabaseRelationshipError) {
      return res.status(errorMappings.databaseRelationship.statusCode).send({
        statusCode: errorMappings.databaseRelationship.statusCode,
        message: err.applicationMessage || errorMappings.databaseRelationship.message
      })
    }
    else if (err instanceof DatabaseError) {
      return res.status(errorMappings.database.statusCode).send({
        statusCode: errorMappings.database.statusCode,
        message: err.applicationMessage || errorMappings.database.message
      })
    }
    else if (err instanceof ApplicationError) {
      return res.status(errorMappings.application.statusCode).send({
        statusCode: errorMappings.application.statusCode,
        message: err.applicationMessage|| errorMappings.application.message
      })
    }
    else {
      return res.status(errorMappings.unknown.statusCode).send({
        statusCode: errorMappings.unknown.statusCode,
        message: errorMappings.unknown.message
      })
    }
  }
}

export {
  ResponseManager
};
