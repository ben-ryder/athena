import {Content} from "../../ui/ui-interfaces";

export interface FolderTreeData {
  name: string,
  content: Content[],
  folders: FolderTreeData[]
}