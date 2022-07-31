/**
 * This interface can be used when creating users.
 * External applications don't need to know about the user encryptionKey.
 */
export interface NoKeysUserDto {
  username: string;
  email: string;
  password: string;
}