import {TagContentDto} from "./tag-content.dto";

export interface TagDto extends TagContentDto {
  id: string;
  backgroundColour: string | null;
  textColour: string | null;
  createdAt: string;
  updatedAt: string;
}
