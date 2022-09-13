import {ContentData} from "../../main/state/features/ui/content/content-selctors";
import {ContentType} from "../../main/state/features/ui/content/content-interface";
import React, {useState} from "react";
import {
  ChevronDown as FolderOpenIcon,
  ChevronRight as FolderClosedIcon,
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  ListChecks as TaskListTypeIcon
} from "lucide-react";
import {iconSizes} from "@ben-ryder/jigsaw";
import classNames from "classnames";

const indentSize = 15;

export interface FolderStructureProps {
  name: string,
  level: number,
  folders: FolderStructureProps[],
  files: ContentData[]
}

export interface FolderItemProps {
  name: string,
  level: number,
  onClick: () => void,
  isExpanded: boolean
}
export function FolderItem(props: FolderItemProps) {
  return (
    <button
      style={{paddingLeft: `${indentSize * props.level}px`}}
      className={classNames(
        "w-full py-1 text-left",
        "text-br-whiteGrey-100 hover:bg-br-atom-800",
        "flex items-center"
      )}
      onClick={props.onClick}
    >
      {props.isExpanded
        ? <FolderOpenIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
        : <FolderClosedIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
      }
      {props.name}
    </button>
  )
}

export interface FileItemProps {
  content: ContentData,
  level: number
}
export function FileItem(props: FileItemProps) {
  let icon;
  if (props.content.type === ContentType.NOTE) {
    icon = <NoteTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall}/>
  }
  else if (props.content.type === ContentType.TEMPLATE) {
    icon = <TemplateTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall} />
  }
  else {
    icon = <TaskListTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall} />
  }

  return (
    <button
      style={{paddingLeft: `${indentSize * props.level}px`}}
      className={classNames(
        "w-full py-1 text-left",
        "text-br-whiteGrey-100 hover:bg-br-atom-800",
        "flex items-center"
      )}
    >
      {icon}
      {props.content.data.name}
    </button>
  )
}

export function FolderStructure(props: FolderStructureProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div>
      <FolderItem
        name={props.name}
        level={props.level}
        isExpanded={isExpanded}
        onClick={() => {setIsExpanded(!isExpanded)}}
      />
      <div
        className={classNames(
        "transition-transform",
          {
            "h-0 opacity-0": !isExpanded
          }
        )}
      >
        {props.folders.map(folderStructure => <FolderStructure {...folderStructure} />)}
        {props.files.map(contentData => <FileItem content={contentData} level={props.level + 1} />)}
      </div>
    </div>
  )
}


export function FolderView() {
  const rootFolder: FolderStructureProps = {
    name: "Vault Name",
    level: 0,
    folders: [
      {
        name: "test 1",
        level: 1,
        folders: [
          {
            name: "test 2",
            level: 2,
            folders: [],
            files: [
              {
                type: ContentType.TEMPLATE,
                data: {
                  id: "test",
                  name: "test name",
                  body: "",
                  createdAt: "",
                  updatedAt: "",
                  folderId: null,
                  targetFolderId: null,
                }
              },
              {
                type: ContentType.TASK_LIST,
                data: {
                  id: "test",
                  name: "test name",
                  createdAt: "",
                  updatedAt: "",
                  folderId: null
                }
              }
            ]
          }
        ],
        files: [
          {
            type: ContentType.NOTE,
            data: {
              id: "test",
              name: "test name",
              body: "",
              createdAt: "",
              updatedAt: "",
              folderId: null
            }
          }
        ]
      }
    ],
    files: [
      {
        type: ContentType.NOTE,
        data: {
          id: "test",
          name: "test name",
          body: "",
          createdAt: "",
          updatedAt: "",
          folderId: null
        }
      }
    ]
  }

  return (
    <FolderStructure {...rootFolder} />
  )
}