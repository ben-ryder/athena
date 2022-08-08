import {NoteDto, UserDto} from "@ben-ryder/athena-js-lib";
import { Popover } from "@headlessui/react";
import {User as AccountIcon} from "lucide-react";
import React from "react";
import {routes} from "../../routes";

export interface NoteCardProps {
  note: NoteDto
}


export function NoteCard(props: NoteCardProps) {
  return (
    <div>
      <h3>{props.note.title}</h3>
    </div>
  )
}