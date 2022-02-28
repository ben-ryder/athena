import { DatabaseError } from './database.error';

/**
 * The database error when a foreign key constraint fails
 * (the user tries to link an entity that doesn't exist)
 */
export class DatabaseRelationshipError extends DatabaseError {}
