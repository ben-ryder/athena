import {Content} from "../../ui/content/content-interface";

export interface FolderTreeData {
  name: string,
  content: Content[],
  folders: FolderTreeData[]
}