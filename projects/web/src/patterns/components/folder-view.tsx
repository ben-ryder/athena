import {ContentData} from "../../state/features/ui/content/content-selctors";
import {ContentType} from "../../state/features/ui/content/content-interface";
import React, {useEffect, useRef, useState} from "react";
import {
  ChevronDown as FolderOpenIcon,
  ChevronRight as FolderClosedIcon,
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  ListChecks as TaskListTypeIcon
} from "lucide-react";
import {iconSizes, StrictReactNode} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {useAppDispatch} from "../../state/store";
import {openAndSwitchContent} from "../../state/features/ui/content/content-actions";
import {ContentActionMenu} from "./popup-menus/content-actions-menus";
import {useSelector} from "react-redux";
import {FolderActionsMenu, RootFolderActionsMenu} from "./popup-menus/folder-actions-menus";
import {Folder} from "../../state/features/database/athena-database";
import {FileSystemFolder, selectFileSystemTree} from "../../state/features/database/folders/folders-selectors";

const indentSize = 15;

export interface FolderItemProps {
  folder: Folder | string,
  level: number,
  onClick: () => void,
  isExpanded: boolean
}
export function FolderItem(props: FolderItemProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<[number, number] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  function checkEvent(e: FocusEvent | MouseEvent) {
    if (menuRef && menuRef.current) {
      if (!menuRef.current.contains(e.target as HTMLElement)) {
        setIsMenuOpen(false);
        document.removeEventListener("focusin", checkEvent);
        document.removeEventListener("click", checkEvent);
        setMenuPosition(null);
      }
    }
  }

  // todo: test if this works.
  useEffect(() => {
    if (isMenuOpen) {
      if (menuRef && menuRef.current) {
        menuRef.current.focus()
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <button
        style={{paddingLeft: `${indentSize * props.level}px`}}
        className={classNames(
          "w-full py-0.5 text-left",
          "text-br-whiteGrey-100 hover:bg-br-atom-800",
          "flex items-center"
        )}
        onClick={props.onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsMenuOpen(true);
          setMenuPosition([e.pageX, e.pageY]);

          document.addEventListener("focusin", checkEvent);
          document.addEventListener("click", checkEvent);
          // todo: add listener to close on any scroll action?
        }}
      >
        {props.isExpanded
          ? <FolderOpenIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
          : <FolderClosedIcon size={iconSizes.extraSmall} className="stroke-br-whiteGrey-200 mr-1" />
        }
        {typeof props.folder === "string" ? props.folder : props.folder.name}
      </button>

      <div
        ref={menuRef}
        className={classNames(
          "fixed z-50 max-w-[160px]",
          {
            "hidden": !isMenuOpen
          }
        )}
        style={{
          left: `${menuPosition ? menuPosition[0] : 0}px`,
          top: `${menuPosition ? menuPosition[1] : 0}px`
        }}
      >
        {typeof props.folder === "string"
          ? <RootFolderActionsMenu />
          : <FolderActionsMenu folder={props.folder} />
        }
      </div>
    </>
  )
}

export interface FileItemProps {
  content: ContentData,
  level: number
}
export function FileItem(props: FileItemProps) {
  const dispatch = useAppDispatch();

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<[number, number] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  let icon: StrictReactNode;
  if (props.content.type === ContentType.NOTE) {
    icon = <NoteTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall}/>
  }
  else if (props.content.type === ContentType.NOTE_TEMPLATE) {
    icon = <TemplateTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall} />
  }
  else {
    icon = <TaskListTypeIcon className="text-br-teal-600 mr-1" size={iconSizes.extraSmall} />
  }

  function checkEvent(e: FocusEvent | MouseEvent) {
    if (menuRef && menuRef.current) {
      if (!menuRef.current.contains(e.target as HTMLElement)) {
        setIsMenuOpen(false);
        document.removeEventListener("focusin", checkEvent);
        document.removeEventListener("click", checkEvent);
        setMenuPosition(null);
      }
    }
  }

  // todo: test if this works.
  useEffect(() => {
    if (isMenuOpen) {
      if (menuRef && menuRef.current) {
        menuRef.current.focus()
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <button
        style={{
          paddingLeft: `${indentSize * props.level}px`,
          // @ts-ignore
          "--folder-line-offset": `${(indentSize * props.level) - (4 * props.level)}px`
        }}
        className={classNames(
          "w-full py-0.5 text-left",
          "text-br-whiteGrey-100 hover:bg-br-atom-800",
          "flex items-center relative",
          {
            "bg-br-atom-800": isMenuOpen,
            "bg-br-atom-900 hover:bg-br-atom-800": !isMenuOpen
          },
          {
            "before:content-[''] before:w-[1px] before:h-full before:bg-br-blueGrey-700 before:z-10 before:block before:absolute before:top-0 before:left-[var(--folder-line-offset)]": props.level > 0,
          }
        )}
        onClick={() => {
          dispatch(openAndSwitchContent({
            type: props.content.type,
            id: props.content.data.id
          }))
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsMenuOpen(true);
          setMenuPosition([e.pageX, e.pageY]);

          document.addEventListener("focusin", checkEvent);
          document.addEventListener("click", checkEvent);
          // todo: add listener to close on any scroll action?
        }}
      >
        {icon}
        {props.content.data.name}
      </button>

      <div
        ref={menuRef}
        className={classNames(
          "fixed z-50 max-w-[160px]",
          {
            "hidden": !isMenuOpen
          }
        )}
        style={{
          left: `${menuPosition ? menuPosition[0] : 0}px`,
          top: `${menuPosition ? menuPosition[1] : 0}px`
        }}
      >
        <ContentActionMenu content={props.content} onClose={() => {setIsMenuOpen(false)}} />
      </div>
    </>
  )
}

export function FileSystem() {
  const fileSystemTree = useSelector(selectFileSystemTree);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <>
      <FolderItem
        folder="/"
        level={0}
        isExpanded={isExpanded}
        onClick={() => {setIsExpanded(!isExpanded)}}
      />
      {isExpanded &&
          <div>
            {fileSystemTree.folders.map(folderStructure =>
              <FileSystemItem key={folderStructure.details.id} folder={folderStructure} level={1}/>
            )}
            {fileSystemTree.files.map(contentData =>
              <FileItem key={contentData.data.id} content={contentData} level={1}/>
            )}
          </div>
      }
    </>
  )
}

export interface FileSystemItemProps {
  folder: FileSystemFolder,
  level: number
}
export function FileSystemItem(props: FileSystemItemProps) {
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
      <FolderItem
        folder={props.folder.details}
        level={props.level}
        isExpanded={isExpanded}
        onClick={() => {setIsExpanded(!isExpanded)}}
      />
      {isExpanded &&
          <div>
            {props.folder.folders.map(folderStructure =>
              <FileSystemItem key={folderStructure.details.id} folder={folderStructure} level={props.level + 1} />
            )}
            {props.folder.files.map(contentData =>
              <FileItem key={contentData.data.id} content={contentData} level={props.level + 1} />
            )}
          </div>
      }
    </div>
  )
}


export function FolderView() {
  return (
    <>
      <FileSystem />
    </>
  )
}
