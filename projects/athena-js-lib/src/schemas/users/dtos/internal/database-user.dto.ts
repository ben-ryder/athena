import {UserDto} from "../user.dto";


export interface DatabaseUserDto extends UserDto {
  passwordHash: string;
}
