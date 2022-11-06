import {useSelector} from "react-redux";
import React, {useState} from "react";
import classNames from "classnames";
import {ChevronDown as FolderOpenIcon, ChevronRight as FolderClosedIcon, FolderInput as MoveIcon} from "lucide-react";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import {Folder} from "../../state/features/database/athena-database";
import {FolderTreeItem, selectFolderTree} from "../../state/features/database/folders/folders-selectors";

const indentSize = 15;

export interface FolderFileSystemItemProps {
  folder: Folder | string,
  level: number,
  onFolderClick: () => void,
  onFolderSelect: (folderId: string | null) => void,
  isExpanded: boolean
}
export function FolderFileSystemItem(props: FolderFileSystemItemProps) {
  const folderName = typeof props.folder === "string" ? props.folder : props.folder.name;

  return (
    <div className="flex">
      <button
        style={{paddingLeft: `${indentSize * props.level}px`}}
        className={classNames(
          "w-full py-0.5 text-left",
          "text-br-whiteGrey-100 hover:bg-br-atom-800",
          "flex items-center"
        )}
        onClick={props.onFolderClick}
      >
        {props.isExpanded
          ? <FolderOpenIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
          : <FolderClosedIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
        }
        {folderName}
      </button>
      <IconButton
        label={`Move to ${folderName}`}
        className="px-2"
        icon={
          <MoveIcon size={iconSizes.extraSmall} className={iconColorClassNames.secondary}/>
        }
        onClick={() => {
          if (typeof props.folder !== 'string') {
            props.onFolderSelect(props.folder.id)
          }
          else {
            props.onFolderSelect(null)
          }
        }}
      />
    </div>
  )
}

export interface FolderFileSystemProps {
  folderTree: FolderTreeItem,
  level: number,
  onFolderSelect: (folderId: string | null) => void,
}
export function FolderFileSystem(props: FolderFileSystemProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      // @ts-ignore
      style={{"--folder-line-offset": `${(indentSize * props.level) - (4 * props.level)}px`}}
      className={classNames(
        "relative",
        {
          "before:content-[''] before:w-[1px] before:h-full before:bg-br-blueGrey-700 before:z-10 before:block before:absolute before:top-0 before:left-[var(--folder-line-offset)]": props.level > 0
        }
      )}
    >
      <FolderFileSystemItem
        folder={props.folderTree.details}
        level={props.level}
        isExpanded={isExpanded}
        onFolderClick={() => {setIsExpanded(!isExpanded)}}
        onFolderSelect={props.onFolderSelect}
      />
      {isExpanded &&
          <div>
            {props.folderTree.folders.map(folderTree =>
              <FolderFileSystem key={folderTree.details.id} folderTree={folderTree} level={props.level + 1} onFolderSelect={props.onFolderSelect}/>
            )}
          </div>
      }
    </div>
  )
}

export interface MoveFolderViewProps {
  onFolderSelect: (folderId: string | null) => void,
}
export function MoveFolderView(props: MoveFolderViewProps) {
  const folderTree = useSelector(selectFolderTree);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      // @ts-ignore
      style={{"--folder-line-offset": `${(indentSize * props.level) - (4 * props.level)}px`}}
      className="relative bg-br-atom-900"
    >
      <FolderFileSystemItem
        folder="/"
        level={0}
        isExpanded={isExpanded}
        onFolderClick={() => {setIsExpanded(!isExpanded)}}
        onFolderSelect={props.onFolderSelect}
      />
      {isExpanded &&
          <div>
            {folderTree.folders.map(folderTree =>
              <FolderFileSystem key={folderTree.details.id} folderTree={folderTree} level={1} onFolderSelect={props.onFolderSelect}/>
            )}
          </div>
      }
    </div>
  )
}