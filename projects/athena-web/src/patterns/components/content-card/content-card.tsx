import React from "react";
import {IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import {formatTimestampSting} from "../../../helpers/format-utc-string";
import classNames from "classnames";
import {
  File as NoteTypeIcon,
  LayoutTemplate as TemplateTypeIcon,
  MoreVertical as FileTabOptionsIcon
} from "lucide-react";
import {useAppDispatch} from "../../../main/state/store";
import {openAndSwitchContent} from "../../../main/state/features/ui/content/content-actions";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";
import {ContentActionsIconAndPopup} from "../popup-menus/content-actions-menu";
import {useSelector} from "react-redux";
import {ContentData, selectActiveContent} from "../../../main/state/features/ui/content/content-selctors";

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
  else {
    icon = <TemplateTypeIcon className="text-br-teal-600" size={iconSizes.small} />
  }

  return (
    <div className={classNames(
      "p-4 mb-4 shadow-sm relative bg-br-atom-700 hover:bg-br-atom-500",
      {
        "border-2 border-br-atom-700": !active,
        "border-2 border-br-teal-600": active
      }
    )}>
      <div className="flex justify-between items-center">
        <div>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-br-whiteGrey-100">{props.content.data.name}</h3>
          <div className="flex flex-wrap mt-1">
            {/*{props.content.data.tags.map(tag =>*/}
            {/*  <Tag*/}
            {/*    key={tag.id}*/}
            {/*    text={tag.name}*/}
            {/*    bgColor={tag.backgroundColour || undefined}*/}
            {/*    fgColor={tag.textColour || undefined}*/}
            {/*    className="mr-2 mt-2"*/}
            {/*  />*/}
            {/*)}*/}
          </div>
        </div>
        <div className="z-20">
          <ContentActionsIconAndPopup content={props.content} />
        </div>
      </div>

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
    </div>
  )
}
