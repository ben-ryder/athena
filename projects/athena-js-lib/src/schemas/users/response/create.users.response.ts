import {UserDto} from "../dtos/user.dto";

export interface CreateUserResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

