/**
 * This interface can be used when creating users.
 *
 * This typing is required as most applications don't need to know about the user encryptionKey,
 * that implementation is encapsulated by the API client library,
 */
export interface NoKeysUserDto {
  username: string;
  email: string;
  password: string;
}