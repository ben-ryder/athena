import {Content} from "../../ui/ui-interface";

export interface FolderTreeData {
  name: string,
  content: Content[],
  folders: FolderTreeData[]
}