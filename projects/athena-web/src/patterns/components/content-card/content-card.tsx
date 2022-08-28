import React from "react";
import {IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import {v4 as createUUID} from "uuid";
import {formatTimestampSting} from "../../../helpers/format-utc-string";
import classNames from "classnames";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import {NoteData} from "../../../main/state/features/open-vault/notes/notes-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {createNote} from "../../../main/state/features/open-vault/notes/notes-actions";
import {TemplateData} from "../../../main/state/features/open-vault/templates/templates-selectors";

export interface NoteCardProps {
  note: NoteData,
  active?: boolean,
}

export function NoteCard(props: NoteCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={classNames(
      "p-4 mb-4 shadow-sm relative bg-br-atom-700 hover:bg-br-atom-500",
      {
        "border-2 border-br-atom-700": !props.active,
        "border-2 border-br-teal-600": props.active
      }
    )}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-br-whiteGrey-100">{props.note.name}</h3>

          <div className="flex flex-wrap mt-1">
            {props.note.tags.map(tag =>
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
          label={`Actions for ${props.note.name}`}
          data-tip={`Actions for ${props.note.name}`}
          icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
          className={`${iconColorClassNames.secondary} h-full flex justify-center items-center z-10`}
          onClick={() => {}}
        />
      </div>

      <div className="mt-3 flex justify-end">
          <p className="text-br-blueGrey-500 italic">{
            formatTimestampSting(props.note.createdAt, props.note.updatedAt)
          }</p>
      </div>

      <button
        data-tip={`Open ${props.note.name}`}
        data-place="right"
        aria-label={`Open ${props.note.name}`}
        className="absolute w-full h-full left-0 top-0"
        onClick={() => {}}
      />
    </div>
  )
}


export interface TemplateCardProps {
  template: TemplateData,
  active?: boolean,
}

export function TemplateCard(props: TemplateCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={classNames(
      "p-4 mb-4 shadow-sm relative bg-br-atom-700 hover:bg-br-atom-500",
      {
        "border-2 border-br-atom-700": !props.active,
        "border-2 border-br-teal-600": props.active
      }
    )}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-bold text-br-whiteGrey-100">{props.template.name}</h3>

          <div className="flex flex-wrap mt-1">
            {props.template.tags.map(tag =>
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
          label={`Actions for ${props.template.name}`}
          data-tip={`Actions for ${props.template.name}`}
          icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
          className={`${iconColorClassNames.secondary} h-full flex justify-center items-center z-10`}
          onClick={() => {}}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <p className="text-br-blueGrey-500 italic">{
          formatTimestampSting(props.template.createdAt, props.template.updatedAt)
        }</p>
      </div>

      <button
        data-tip={`Open ${props.template.name}`}
        data-place="right"
        aria-label={`Open ${props.template.name}`}
        className="absolute w-full h-full left-0 top-0"
        onClick={() => {}}
      />
    </div>
  )
}