import {UserDto} from "../user.dto";


export interface InternalDatabaseUserDto extends UserDto {
  id: string;
  username: string;
  email: string;
  encryption_secret: string;
  password_hash: string
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
