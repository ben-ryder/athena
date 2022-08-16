import React from "react";
import {IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import {formatTimestampSting} from "../../../helpers/date-helper";
import classNames from "classnames";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import {Content} from "../../../helpers/content-state";

export interface ContentCardProps {
  content: Content,
  active?: boolean,
  openAndSwitchContent: (content: Content) => void
}

export function ContentCard(props: ContentCardProps) {
  return (
    <div className={classNames(
      "m-4 p-4 shadow-sm relative bg-br-atom-700 hover:bg-br-atom-500",
      {
        "border-2 border-br-atom-700": !props.active,
        "border-2 border-br-teal-600": props.active
      }
    )}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-br-whiteGrey-100">{props.content.content.title}</h3>

          <div className="flex flex-wrap mt-1">
            {props.content.content.tags.map(tag =>
              <Tag
                key={tag.id}
                text={tag.name}
                bgColor={tag.backgroundColour || undefined}
                fgColor={tag.textColour || undefined}
                className="mr-2 mt-2"
              />
            )}
          </div>
        </div>
        <IconButton
          label={`Actions for ${props.content.content.title}`}
          data-tip={`Actions for ${props.content.content.title}`}
          icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
          className={`${iconColorClassNames.secondary} h-full flex justify-center items-center z-10`}
          onClick={() => {}}
        />
      </div>

      <div className="mt-3 flex justify-end">
        {props.content.type === "note-edit" || props.content.type === "template-edit" &&
            <p className="text-br-blueGrey-500 italic">{
              formatTimestampSting(props.content.content.createdAt, props.content.content.updatedAt)
            }</p>
        }
      </div>

      <button
        data-tip={`Open ${props.content.content.title}`}
        data-place="right"
        aria-label={`Open ${props.content.content.title}`}
        className="absolute w-full h-full left-0 top-0"
        onClick={() => {props.openAndSwitchContent(props.content)}}
      />
    </div>
  )
}