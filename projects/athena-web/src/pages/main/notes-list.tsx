import {useAthena} from "../../helpers/use-athena";
import React, {useEffect, useState} from "react";
import {testData, testUsers} from "@ben-ryder/athena-testing";
import {NoteDto} from "@ben-ryder/athena-js-lib";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {Content} from "../../helpers/content-state";

export interface NotesListProps {
  activeContent: Content | null;
  openAndSwitchContent: (content: Content) => void
}

export function NotesList(props: NotesListProps) {
  const {apiClient} = useAthena();
  const [notes, setNotes] = useState<NoteDto[]>(testData[testUsers[0].id].notes);

  function isNoteActive(note: NoteDto, activeContent: Content | null) {
    let active = false;
    if (activeContent && (activeContent.type === "note-edit" || activeContent.type === "template-edit")) {
      active = activeContent.content.id === note.id
    }
    return active;
  }

  return (
    <>
      {notes.map(note =>
        <ContentCard
          key={note.id}
          content={{type: "note-edit", content: note}}
          active={isNoteActive(note, props.activeContent)}
          openAndSwitchContent={props.openAndSwitchContent}
        />
      )}
      {notes.length === 0 &&
        <div className="m-4">
            <p className="text-center text-br-whiteGrey-100">0 Notes Found</p>
        </div>
      }
    </>
  )
}