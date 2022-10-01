import {DatabaseUserDto} from "@ben-ryder/athena-js-lib";

export interface TestUserDto extends DatabaseUserDto {
  password: string;
  encryptionKey: string;
}
