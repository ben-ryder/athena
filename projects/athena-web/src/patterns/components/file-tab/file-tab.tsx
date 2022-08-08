import React from "react";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  MoreVertical as FileTabOptionsIcon,
  X as CloseIcon
} from "lucide-react";

import {NoteDto, TemplateDto} from "@ben-ryder/athena-js-lib";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";


export interface FileTabProps {

}

export interface NoteFileTabProps extends FileTabProps {
  note: NoteDto
}


export function NoteFileTab(props: NoteFileTabProps) {
  return (
    <div className="flex items-center px-2 border-r border-br-blueGrey-600 hover:bg-br-atom-600">
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