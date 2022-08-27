import React from "react";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  MoreVertical as FileTabOptionsIcon,
  X as CloseIcon
} from "lucide-react";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {ContentType} from "../../../main/state/features/ui/ui-interfaces";
import {ContentData} from "../../../main/state/features/ui/ui-selctors";


export interface ContentFileTabProps {
  content: ContentData,
  active?: boolean,
  switchToContent: () => void,
  closeContent: () => void
}


export function ContentFileTab(props: ContentFileTabProps) {
  let icon;
  if (props.content.type === ContentType.NOTE) {
    icon = <NoteTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall}/>
  }
  else {
    icon = <TemplateTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall} />
  }

  return (
    <div className={classNames(
      "flex items-center px-2 border-r border-br-blueGrey-600 bg-br-atom-700 hover:bg-br-atom-500",
      "border-t-2 border-t-transparent",
      {
        "border-b-2 border-b-transparent": !props.active,
        "border-b-2 border-b-br-teal-600": props.active
      }
    )}>
      {icon}
      <button
        data-tip={`Switch to ${props.content.data.name}`}
        className="hover:underline whitespace-nowrap text-br-whiteGrey-100 mx-2"
        onClick={() => {}}
      >{props.content.data.name}</button>
      <IconButton
        label={`Actions for ${props.content.data.name}`}
        data-tip={`Actions for ${props.content.data.name}`}
        icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
      <IconButton
        label={`Close ${props.content.data.name}`}
        data-tip={`Close ${props.content.data.name}`}
        icon={<CloseIcon size={iconSizes.extraSmall} />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {}}
      />
    </div>
  )
}
