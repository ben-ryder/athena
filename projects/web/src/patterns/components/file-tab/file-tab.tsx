import React from "react";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  ListChecks as TaskListTypeIcon,
  X as CloseIcon
} from "lucide-react";
import {IconButton, iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {ContentData} from "../../../state/features/ui/content/content-selctors";
import {useAppDispatch} from "../../../state/store";
import {closeContent, openAndSwitchContent} from "../../../state/features/ui/content/content-actions";
import {ContentActionsIconAndPopup} from "../popup-menus/content-actions-icon-and-popup";


export interface ContentFileTabProps {
  content: ContentData,
  active?: boolean,
  switchToContent: () => void,
  closeContent: () => void
}


export function ContentFileTab(props: ContentFileTabProps) {
  const dispatch = useAppDispatch();

  let icon;
  if (props.content.type === ContentType.NOTE) {
    icon = <NoteTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall}/>
  }
  else if (props.content.type === ContentType.NOTE_TEMPLATE){
    icon = <TemplateTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall} />
  }
  else {
      icon = <TaskListTypeIcon className="text-br-teal-600" size={iconSizes.extraSmall} />
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
        onClick={() => {
          dispatch(openAndSwitchContent({
            type: props.content.type,
            id: props.content.data.id
          }))
        }}
      >{props.content.data.name}</button>
      <ContentActionsIconAndPopup content={props.content}/>
      <IconButton
        label={`Close ${props.content.data.name}`}
        data-tip={`Close ${props.content.data.name}`}
        icon={<CloseIcon size={iconSizes.extraSmall} />}
        className={`${iconColorClassNames.secondary} h-full flex justify-center items-center`}
        onClick={() => {
          dispatch(closeContent({
            type: props.content.type,
            id: props.content.data.id
          }))
        }}
      />
    </div>
  )
}
