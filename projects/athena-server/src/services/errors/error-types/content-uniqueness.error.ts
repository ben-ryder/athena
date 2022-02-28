import { UserRequestError } from './user-request.error';

/**
 * The database error for when a user tries to add content that
 * fails a uniqueness constraint.
 * For example, they try adding an entity with a name that is already taken.
 */
export class ContentUniquenessError extends UserRequestError {}
