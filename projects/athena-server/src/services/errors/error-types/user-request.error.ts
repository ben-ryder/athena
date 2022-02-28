import { ApplicationError } from "./application.error";

/**
 * The generic error that all user based errors inherit from.
 *
 * These are expected errors caused by the user such as
 * malformed/invalid requests, asking for data that doesn't exist etc.
 */
export class UserRequestError extends ApplicationError {}
