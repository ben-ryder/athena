import { UserRequestError } from './user-request.error';

/**
 * The database error for when a user requests content that doesn't exist.
 */
export class ContentNotFoundError extends UserRequestError {}
