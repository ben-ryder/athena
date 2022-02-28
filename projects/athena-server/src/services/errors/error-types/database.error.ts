import { ApplicationError } from "./application.error";

/**
 * The generic database error that all database level errors inherit from.
 */
export class DatabaseError extends ApplicationError {}
