import {TagContentDto} from "./tag-content.dto";

export interface TagDto extends TagContentDto {
  id: string;
  backgroundColour: string;
  textColour: string;
  createdAt: string;
  updatedAt: string;
}
