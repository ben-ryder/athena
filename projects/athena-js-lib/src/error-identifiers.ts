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
  VAULT_NAME_EXISTS = "vault-name-exists"
}

