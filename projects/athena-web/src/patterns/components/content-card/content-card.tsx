import React from "react";
import {iconSizes} from "@ben-ryder/jigsaw";
import classNames from "classnames";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  ListChecks as TaskListTypeIcon
} from "lucide-react";
import {useAppDispatch} from "../../../state/store";
import {openAndSwitchContent} from "../../../state/features/ui/content/content-actions";
import {ContentType} from "../../../state/features/ui/content/content-interface";
import {ContentActionsIconAndPopup} from "../popup-menus/content-actions-icon-and-popup";
import {useSelector} from "react-redux";
import {ContentData, selectActiveContent} from "../../../state/features/ui/content/content-selctors";
import {ContentTags} from "./content-tags";

export interface ContentCardProps {
  content: ContentData
}

export function ContentCard(props: ContentCardProps) {
  const dispatch = useAppDispatch();
  const activeContent = useSelector(selectActiveContent);
  const active = activeContent?.data.id === props.content.data.id;

  let icon;
  if (props.content.type === ContentType.NOTE) {
    icon = <NoteTypeIcon className="text-br-teal-600" size={iconSizes.small}/>
  }
  else if (props.content.type === ContentType.NOTE_TEMPLATE) {
    icon = <TemplateTypeIcon className="text-br-teal-600" size={iconSizes.small} />
  }
  else {
    icon = <TaskListTypeIcon className="text-br-teal-600" size={iconSizes.small} />
  }

  return (
    <div className={classNames(
      "p-3 mb-4 shadow-sm relative bg-br-atom-700 hover:bg-br-atom-500",
      {
        "border-2 border-br-atom-700": !active,
        "border-2 border-br-teal-600": active
      }
    )}>

      {/** Button comes first to ensure content comes before actions menu in tab order **/}
      <button
        data-tip={`Open ${props.content.data.name}`}
        data-place="right"
        aria-label={`Open ${props.content.data.name}`}
        className="absolute w-full h-full left-0 top-0"
        onClick={() => {
          dispatch(openAndSwitchContent({
            type: props.content.type,
            id: props.content.data.id
          }))
        }}
      />

      <div className="flex justify-between items-center">
        <div className="mr-3">
          {icon}
        </div>
        <div className="grow">
          <h3 className="text-xl font-bold text-br-whiteGrey-100 mb-2">{props.content.data.name}</h3>
          <ContentTags content={props.content} />
        </div>
        <div className="z-10">
          <ContentActionsIconAndPopup content={props.content} />
        </div>
      </div>
    </div>
  )
}
