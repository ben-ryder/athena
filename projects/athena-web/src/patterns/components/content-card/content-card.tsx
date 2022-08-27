import React from "react";
import {IconButton, iconColorClassNames, iconSizes, Tag} from "@ben-ryder/jigsaw";
import {v4 as createUUID} from "uuid";
import {formatTimestampSting} from "../../../helpers/format-utc-string";
import classNames from "classnames";
import {MoreVertical as FileTabOptionsIcon} from "lucide-react";
import {NoteData} from "../../../main/state/features/open-vault/notes/notes-selectors";
import {useAppDispatch} from "../../../main/state/store";
import {createNote} from "../../../main/state/features/open-vault/notes/notes-actions";

export interface ContentCardProps {
  note: NoteData,
  active?: boolean,
}

export function NoteCard(props: ContentCardProps) {
  const dispatch = useAppDispatch();

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
        onClick={() => {
          dispatch(createNote({
            id: createUUID(),
            uuid: createUUID(),
            name: "untitled",
            body: "",
            folderId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }))
        }}
      />
    </div>
  )
}