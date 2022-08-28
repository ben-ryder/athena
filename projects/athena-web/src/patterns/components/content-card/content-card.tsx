import React from "react";
import {IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import {formatTimestampSting} from "../../../helpers/format-utc-string";
import classNames from "classnames";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import {selectNote} from "../../../main/state/features/open-vault/notes/notes-selectors";
import {useAppDispatch, useAppSelector} from "../../../main/state/store";
import {TemplateData} from "../../../main/state/features/open-vault/templates/templates-selectors";
import {switchContent} from "../../../main/state/features/ui/content/content-actions";
import {ContentType} from "../../../main/state/features/ui/content/content-interface";

export interface NoteCardProps {
  noteId: string,
  active?: boolean,
}

export function NoteCard(props: NoteCardProps) {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state);
  const note = selectNote(state, props.noteId);

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
          <h3 className="text-xl font-bold text-br-whiteGrey-100">{note.name}</h3>

          <div className="flex flex-wrap mt-1">
            {note.tags.map(tag =>
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
          label={`Actions for ${note.name}`}
          data-tip={`Actions for ${note.name}`}
          icon={<FileTabOptionsIcon size={iconSizes.extraSmall} />}
          className={`${iconColorClassNames.secondary} h-full flex justify-center items-center z-10`}
          onClick={() => {}}
        />
      </div>

      <div className="mt-3 flex justify-end">
          <p className="text-br-blueGrey-500 italic">{
            formatTimestampSting(note.createdAt, note.updatedAt)
          }</p>
      </div>

      <button
        data-tip={`Open ${note.name}`}
        data-place="right"
        aria-label={`Open ${note.name}`}
        className="absolute w-full h-full left-0 top-0"
        onClick={() => {
          dispatch(switchContent({
            type: ContentType.NOTE,
            id: note.id
          }))
        }}
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