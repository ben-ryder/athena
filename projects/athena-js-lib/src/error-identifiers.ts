/**
 * Error identifiers which can be used in API responses and error handling
 * to specify the exact error that happened.
 */

export enum AthenaErrorIdentifiers {
  // User Errors
  USER_NOT_FOUND = "user-not-found",
  USER_USERNAME_EXISTS = "user-username-exists",
  USER_EMAIL_EXISTS = "user-email-exists",
  USER_REGISTRATION_DISABLED = "user-registration-disabled",

  // Authentication
  AUTH_CREDENTIALS_INVALID = "auth-credentials-invalid",
  AUTH_TOKEN_INVALID = "auth-token-invalid",
  AUTH_EMAIL_NOT_VERIFIED = "auth-email-not-verified",

  // Vault Errors
  VAULT_NAME_EXISTS = "vault-name-exists",
  VAULT_NOT_FOUND = "vault-not-found",

  // Note Errors
  NOTE_NOT_FOUND = "note-not-found",

  // Tags Error
  TAG_NOT_FOUND = "tag-not-found",

  /**
   * Identifiers matching KangoJS identifiers below
   * @todo get from KangoJS instead?
   */

  // Generalised Errors
  NOT_FOUND = "not-found",

  // System Errors
  SYSTEM_UNEXPECTED = "system-unexpected-error",

  // User
  USER_REQUEST_INVALID = "user-request-invalid",

  // Access Errors
  ACCESS_UNAUTHORIZED = "access-unauthorized",
  ACCESS_FORBIDDEN = "access-forbidden",

  // Resource Errors
  RESOURCE_NOT_FOUND = "resource-not-found",
  RESOURCE_NOT_UNIQUE = "resource-not-unique",
  RESOURCE_RELATIONSHIP_INVALID = "resource-relationship-invalid",
}
