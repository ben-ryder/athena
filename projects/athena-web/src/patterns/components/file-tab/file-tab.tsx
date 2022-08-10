import React from "react";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  MoreVertical as FileTabOptionsIcon,
  X as CloseIcon
} from "lucide-react";

import {NoteDto, TemplateDto} from "@ben-ryder/athena-js-lib";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import classNames from "classnames";


export interface FileTabProps {

}

export interface NoteFileTabProps extends FileTabProps {
  note: NoteDto,
  active?: boolean
}


export function NoteFileTab(props: NoteFileTabProps) {
  return (
    <div className={classNames(
      "flex items-center px-2 border-r border-br-blueGrey-600 bg-br-atom-700 hover:bg-br-atom-500",
      "border-t-2 border-t-transparent",
      {
        "border-b-2 border-b-transparent": !props.active,
        "border-b-2 border-b-br-teal-600": props.active
      }
    )}>
      <NoteTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall}/>
      <button
        data-tip={`Switch to ${props.note.title}`}
        className="hover:underline whitespace-nowrap text-br-whiteGrey-100 mx-2"
      >test note 1</button>
      <IconButton
        label={`Actions for ${props.note.title}`}
        data-tip={`Actions for ${props.note.title}`}
        icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
      <IconButton
        label={`Close ${props.note.title}`}
        data-tip={`Close ${props.note.title}`}
        icon={<CloseIcon size={iconSizes.extraSmall} />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
    </div>
  )
}


export interface TemplateFileTabProps extends FileTabProps {
  template: TemplateDto
}


export function TemplateFileTab(props: TemplateFileTabProps) {
  return (
    <div className="flex items-center">
      <TemplateTypeIcon />
      <button className="hover:underline">test template 1</button>
      <IconButton
        label="Template Actions"
        data-tip="Template Actions"
        icon={<FileTabOptionsIcon />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
      <IconButton
        label="Template Note"
        data-tip="Template Note"
        icon={<CloseIcon />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
    </div>
  )
}