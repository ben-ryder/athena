import {UserDto} from "../../users/dtos/user.dto";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}